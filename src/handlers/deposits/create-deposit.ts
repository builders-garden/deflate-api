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

    const { data } = depositStrategy;

    const chain = data?.chainId === 8453 ? base : polygon;
    const deflatePortalAddress =
      data?.chainId === 8453
        ? BASE_DEFLATE_PORTAL_ADDRESS
        : POLYGON_DEFLATE_PORTAL_ADDRESS;

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
      functionName: "executeStrategy",
      args: [data?.data],
    });
    const txReceipt = await client.writeContract(request);
    // Wait for transaction to be mined
    const txReceiptData = await publicClient.waitForTransactionReceipt({
      hash: txReceipt,
    });

    // Temporary response
    res.json({
      success: true,
      data: {
        userAddress,
        amount,
        strategy,
        timestamp: new Date().toISOString(),
        status: "pending",
        txHash: txReceiptData.transactionHash,
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
