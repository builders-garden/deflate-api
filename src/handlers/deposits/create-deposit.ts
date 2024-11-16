import { Request, Response } from "express";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";
import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  erc20Abi,
  http,
} from "viem";
import { base, polygon } from "viem/chains";
import { getDepositStrategy } from "../../services/deflate-agent/strategy-handler";
import { DEFLATE_PORTAL_ABI } from "../../utils/abis";
import { environment } from "../../config/environment";
import {
  BASE_DEFLATE_PORTAL_ADDRESS,
  BASE_USDC_ADDRESS,
  POLYGON_DEFLATE_PORTAL_ADDRESS,
} from "../../utils/constants";
import { redis } from "../../services/redis";
import { sendTransactionWithSession } from "../../services/biconomy";
import { SessionData } from "@biconomy/sdk";
// Define the input validation schema
const depositSchema = z.object({
  userRiskProfile: z.string().array(),
  userAddress: z.string().startsWith("0x"),
  amount: z.number().positive(),
  strategy: z.number().min(1).max(3),
  fake: z.boolean().default(true),
});

// Type for the request body
type DepositRequest = z.infer<typeof depositSchema>;

export const createDeposit = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const userAddress = user.customMetadata.smartAccountAddress;
    // Validate the request body
    const { amount, strategy, userRiskProfile, fake } = depositSchema.parse(
      req.body
    );

    //load Account from Agent Private Key
    const agentAccount = privateKeyToAccount(
      environment.AGENT_PRIVATE_KEY! as `0x${string}`
    );

    //calculate deposit strategy
    const depositStrategy = await getDepositStrategy({
      userAddress,
      amount,
      strategy,
      userRiskProfile,
    });

    const { success, data } = depositStrategy;
    console.log;
    const totalTransactions = data?.totalTransactions;
    const transactions = data?.transactions;

    const basePublicClient = createPublicClient({
      chain: base,
      transport: http(),
    });
    const baseWalletClient = createWalletClient({
      account: agentAccount,
      chain: base,
      transport: http(),
    });
    if (fake) {
      console.log("fake onramping user");

      // send 5 USDC to the smart wallet
      const fundTx = await baseWalletClient.writeContract({
        abi: erc20Abi,
        address: BASE_USDC_ADDRESS,
        functionName: "transfer",
        args: [userAddress as `0x${string}`, 5000000n],
      });

      await basePublicClient.waitForTransactionReceipt({
        hash: fundTx,
      });
    }

    console.log(transactions, "transactions------");

    const compressedSessionData = await redis.get(
      user?.customMetadata.smartAccountAddress
    );
    await sendTransactionWithSession(
      JSON.parse(compressedSessionData as string) as SessionData,
      [
        {
          to: BASE_USDC_ADDRESS,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "approve",
            args: [BASE_DEFLATE_PORTAL_ADDRESS as `0x${string}`, BigInt(2 ** 256 - 1)],
          }),
          value: 0n,
        },
      ]
    );

    // Execute each transaction sequentially
    const txResults = [];
    const successfulTxs = [];

    for (const tx of transactions!) {
      try {
        const chain = tx.chainId === 8453 ? base : polygon;
        const deflatePortalAddress =
          tx.chainId === 8453
            ? BASE_DEFLATE_PORTAL_ADDRESS
            : POLYGON_DEFLATE_PORTAL_ADDRESS;

        const client = createWalletClient({
          account: agentAccount,
          chain: chain,
          transport: http(),
        });
        const publicClient = createPublicClient({
          chain: chain,
          transport: http(),
        });

        const { request } = await publicClient.simulateContract({
          account: agentAccount,
          address: deflatePortalAddress as `0x${string}`,
          abi: DEFLATE_PORTAL_ABI,
          functionName: "executeStrategy",
          args: [tx.data],
        });
        const txReceipt = await client.writeContract(request);
        const txReceiptData = await publicClient.waitForTransactionReceipt({
          hash: txReceipt,
        });

        // Store successful transaction data
        successfulTxs.push({
          timestamp: new Date().toISOString(),
          transactionHash: txReceiptData.transactionHash,
          chainId: tx.chainId,
          tokenAddress: tx.tokenAddress,
          tokenAmount: tx.tokenAmount,
          details: tx.details,
          strategy: tx.strategy,
        });

        txResults.push(txReceiptData);
      } catch (error) {
        console.error(`Transaction failed:`, error);
        // Continue with next transaction
      }
    }

    // Store successful transactions in Redis
    if (successfulTxs.length > 0) {
      try {
        // Get existing transactions for this user
        const existingTxs = (await redis.get(userAddress)) || "[]";
        const allTxs = [
          ...JSON.parse(existingTxs.toString()),
          ...successfulTxs,
        ];

        // Store updated transactions list
        await redis.set(userAddress, JSON.stringify(allTxs));
      } catch (redisError) {
        console.error("Redis storage error:", redisError);
      }
    }

    // Temporary response
    res.json({
      success: true,
      data: {
        userAddress,
        amount,
        strategy,
        timestamp: new Date().toISOString(),
        status: "pending",
        txHashes: txResults.map((tx) => tx.transactionHash),
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

    console.error("Deposit error:", error);
    res.json({
      success: false,
      error: "Failed to process deposit",
    });
  }
};
