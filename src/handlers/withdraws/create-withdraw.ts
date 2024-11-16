import { Request, Response } from "express";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";
import { createPublicClient, createWalletClient, http } from "viem";
import { base, polygon } from "viem/chains";
import { DEFLATE_PORTAL_ABI } from "../../utils/abis";
import { environment } from "../../config/environment";
import { Redis } from '@upstash/redis'


// Define the input validation schema
const withdrawSchema = z.object({
  userAddress: z.string().startsWith("0x"),
});

// Type for the request body
type WithdrawRequest = z.infer<typeof withdrawSchema>;

const redis = new Redis({
    url: process.env.REDIS_URL as string,
    token: process.env.REDIS_TOKEN as string,
  })

interface Position {
  timestamp: string;
  transactionHash: string;
  chainId: number;
  tokenAddress: string;
  tokenAmount: string;
  details: any;
  strategy: number;
}

export const createWithdraw = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { userAddress } = withdrawSchema.parse(req.body);

    // Get positions from Redis
    const positionsStr = await redis.get(userAddress);
    if (!positionsStr) {
      return res.json({
        success: false,
        error: "No positions found for this address",
      });
    }

    const positions: Position[] = JSON.parse(positionsStr.toString());

    // Group positions by chainId
    const positionsByChain = positions.reduce((acc, position) => {
      if (!acc[position.chainId]) {
        acc[position.chainId] = [];
      }
      acc[position.chainId].push(position);
      return acc;
    }, {} as Record<number, Position[]>);

    // Prepare transactions for each chain
    const transactions = [];
    for (const [chainId, chainPositions] of Object.entries(positionsByChain)) {
      const deflatePortalAddress = Number(chainId) === 8453 
        ? process.env.BASE_DEFLATE_PORTAL_ADDRESS 
        : process.env.POLYGON_DEFLATE_PORTAL_ADDRESS;

      // Prepare withdrawal data for each position
      for (const position of chainPositions) {
        const withdrawData = {
          tokenAddress: position.tokenAddress,
          amount: position.tokenAmount,
          strategy: position.strategy,
          // Add any additional data needed for withdrawal
        };

        transactions.push({
          chainId: Number(chainId),
          deflatePortalAddress,
          data: withdrawData,
          originalPosition: position,
        });
      }
    }

    // Execute transactions
    const txResults = [];
    const account = privateKeyToAccount(
      environment.AGENT_PRIVATE_KEY! as `0x${string}`
    );

    for (const tx of transactions) {
      try {
        const chain = tx.chainId === 8453 ? base : polygon;
        
        const client = createWalletClient({
          account,
          chain: chain,
          transport: http(),
        });
        
        const publicClient = createPublicClient({
          chain: chain,
          transport: http(),
        });

        const { request } = await publicClient.simulateContract({
          account,
          address: tx.deflatePortalAddress as `0x${string}`,
          abi: DEFLATE_PORTAL_ABI,
          functionName: 'withdrawStrategy',
          args: [tx.data],
        });

        const txReceipt = await client.writeContract(request);
        const txReceiptData = await publicClient.waitForTransactionReceipt({
          hash: txReceipt,
        });

        txResults.push({
          chainId: tx.chainId,
          transactionHash: txReceiptData.transactionHash,
          position: tx.originalPosition,
          success: true,
        });
      } catch (error) {
        console.error(`Withdrawal transaction failed:`, error);
        txResults.push({
          chainId: tx.chainId,
          position: tx.originalPosition,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Filter out positions that were successfully withdrawn
    const successfulPositionHashes = new Set(
      txResults
        .filter(tx => tx.success)
        .map(tx => tx.position.transactionHash)
    );

    // Update Redis with remaining positions
    if (successfulPositionHashes.size > 0) {
      const remainingPositions = positions.filter(
        position => !successfulPositionHashes.has(position.transactionHash)
      );
      
      if (remainingPositions.length > 0) {
        await redis.set(userAddress, JSON.stringify(remainingPositions));
      } else {
        await redis.del(userAddress);
      }
    }

    res.json({
      success: true,
      data: {
        userAddress,
        withdrawals: txResults,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.json({
        success: false,
        error: "Invalid input",
        details: error.errors,
      });
    }

    console.error("Withdrawal error:", error);
    res.json({
      success: false,
      error: "Failed to process withdrawal",
    });
  }
};
