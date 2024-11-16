import { Request, Response } from "express";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";
import { createPublicClient, createWalletClient, http } from "viem";
import { base, polygon } from "viem/chains";
import { writeContract } from "viem/_types/actions/wallet/writeContract";
import { getDepositStrategy } from "../../services/deflate-agent/strategy-handler";
import { DEFLATE_PORTAL_ABI } from "../../utils/abis";
import { environment } from "../../config/environment";
import { BASE_DEFLATE_PORTAL_ADDRESS, POLYGON_DEFLATE_PORTAL_ADDRESS } from "../../utils/constants";

// Define the input validation schema
const depositSchema = z.object({
  userAddress: z.string().startsWith("0x"),
  amount: z.number().positive(),
  strategy: z.number().min(1).max(3),
});

// Type for the request body
type DepositRequest = z.infer<typeof depositSchema>;

export const createDeposit = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { userAddress, amount, strategy } = depositSchema.parse(req.body);

    //load Account from Agent Private Key
    const account = privateKeyToAccount(
      environment.AGENT_PRIVATE_KEY! as `0x${string}`
    );

    //calculate deposit strategy
    const depositStrategy = await getDepositStrategy({
      userAddress,
      amount,
      strategy,
    });

    const { success, data } = depositStrategy;
    const totalTransactions = data?.totalTransactions;
    const transactions = data?.transactions;

    console.log(transactions, "transactions------");

    // Execute each transaction sequentially
    const txResults = [];
    for (const tx of transactions!) {
        const chain = tx.chainId === 8453 ? base : polygon;
        const deflatePortalAddress = tx.chainId === 8453 
            ? process.env.BASE_DEFLATE_PORTAL_ADDRESS 
            : process.env.POLYGON_DEFLATE_PORTAL_ADDRESS;

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
            address: deflatePortalAddress as `0x${string}`,
            abi: DEFLATE_PORTAL_ABI,
            functionName: 'executeStrategy',
            args: [tx.data],
        });
        const txReceipt = await client.writeContract(request);
        const txReceiptData = await publicClient.waitForTransactionReceipt({
            hash: txReceipt,
        });
        txResults.push(txReceiptData);
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
        txHashes: txResults.map(tx => tx.transactionHash),
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
