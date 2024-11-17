import { ToNexusSmartAccountParameters } from './../../../node_modules/@biconomy/sdk/dist/_types/account/toNexusAccount.d';
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
import { DEFLATE_PORTAL_ABI, PORTAL_ABI } from "../../utils/abis";
import { environment } from "../../config/environment";
import {
  BASE_PORTAL_ADDRESS,
  BASE_USDC_ADDRESS,
  POLYGON_DEFLATE_PORTAL_ADDRESS,
} from "../../utils/constants";
import { redis } from "../../services/redis";
import { sendTransactionWithSession } from "../../services/biconomy";
import { SessionData } from "@biconomy/sdk";
import { entryPoint07Abi } from "viem/_types/account-abstraction";
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
    const totalTransactions = data?.totalTransactions;
    const transactions = data?.transactions;
    /*

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

      const balance = await basePublicClient.readContract({
        abi: erc20Abi,
        address: BASE_USDC_ADDRESS,
        functionName: "balanceOf",
        args: [user?.customMetadata.smartAccountAddress as `0x${string}`],
      });
      if (balance < 5000000n) {
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
    }

    console.log(transactions, "transactions------");

    // const totalSupply = await basePublicClient.readContract({
    //   abi: erc20Abi,
    //   address: BASE_USDC_ADDRESS,
    //   functionName: "totalSupply",
    // });
    // const userData = (await redis.get(
    //   user?.customMetadata.smartAccountAddress
    // )) as any;

    // await sendTransactionWithSession(
    //   JSON.parse(userData?.compressedSessionData as string) as SessionData,
    //   [
    //     {
    //       to: BASE_USDC_ADDRESS,
    //       data: encodeFunctionData({
    //         abi: erc20Abi,
    //         functionName: "approve",
    //         args: [BASE_DEFLATE_PORTAL_ADDRESS as `0x${string}`, totalSupply],
    //       }),
    //       value: BigInt(0),
    //     },
    //   ]
    // );

    // console.log("sent tx with session------");
*/
    // Execute each transaction sequentially
    const successfulTxs = [];

    for (const tx of transactions!) {
      try {
        /*
        const chain = tx.chainId === 8453 ? base : polygon;
        const deflatePortalAddress =
          tx.chainId === 8453
            ? BASE_PORTAL_ADDRESS
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

        const hash = await client.sendTransaction({
          to: deflatePortalAddress as `0x${string}`,
          abi: PORTAL_ABI,
          functionName: "portal",
          data: tx.data as `0x${string}`
        });
        const txReceiptData = await publicClient.waitForTransactionReceipt({
          hash,
        });
        */

        // Store successful transaction data
        successfulTxs.push({
          timestamp: new Date().toISOString(),
          chainId: tx.chainId,
          tokenAddress: tx.tokenAddress,
          tokenAmount: tx.tokenAmount,
          details: tx.details,
          strategy: tx.strategy,
        });

      } catch (error) {
        console.error(`Transaction failed:`, error);
        // Continue with next transaction
      }
    }

    // Store successful transactions in Redis
    if (successfulTxs?.length > 0) {
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
        transactions
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
