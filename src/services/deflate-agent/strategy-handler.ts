import openai, { OpenAI } from "openai";
import { TransactionResponse } from "./Brian-api-interface";

const BRIAN_API_BASE_URL = "https://a4ab-210-1-49-170.ngrok-free.app";

interface DepositParams {
  userAddress: string;
  amount: number;
  strategy: number; // 1 or 2
  userRiskProfile: string[];
}

interface StrategyResponse {
  success: boolean;
  data?: {
    transactions: Array<{
      data?: string;
      strategy: number;
      details: string;
      chainId: number;
      tokenAddress: string;
      tokenAmount: number;
    }>;
    totalTransactions: number;
  };
  error?: string;
}

const findStableLiquidityCross = async (userAddress: string) => {
  const baseUsdcLendingApy = (await fetch(
    `${BRIAN_API_BASE_URL}/api/v0/agent/transaction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-brian-api-key": `${process.env.BRIAN_API_KEY}`,
      },
      body: JSON.stringify({
        prompt:
          "Give me investment advice for usdc on base with liquidity > 5 milions",
        address: userAddress,
      }),
    }
  ).then((res) => res.json())) as TransactionResponse;

  // const polygonUsdcLendingApy = (await fetch(
  //   `${BRIAN_API_BASE_URL}/api/v0/agent/transaction`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-brian-api-key": `${process.env.BRIAN_API_KEY}`,
  //     },
  //     body: JSON.stringify({
  //       prompt:
  //         "Give me investment advice for usdc on polygon with liquidity > 5 milions",
  //       address: userAddress,
  //     }),
  //   }
  // ).then((res) => res.json())) as TransactionResponse;

  return {
    baseStrategy: {
      description: baseUsdcLendingApy.result[0].data.description,
      chainId: baseUsdcLendingApy.result[0].data.fromChainId,
    },
    // polygonStrategy: {
    //   description: polygonUsdcLendingApy.result[0].data.description,
    //   chainId: polygonUsdcLendingApy.result[0].data.fromChainId,
    // },
  };
};

const findLiquiditySingle = async (userAddress: string) => {
  const baseEthLendingApy = (await fetch(
    `${BRIAN_API_BASE_URL}/api/v0/agent/transaction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-brian-api-key": `${process.env.BRIAN_API_KEY}`,
      },
      body: JSON.stringify({
        prompt:
          "Give me investment advice for wsteth on base with liquidity > 20 milions on aave",
        address: userAddress,
      }),
    }
  ).then((res) => res.json())) as TransactionResponse;

  const baseCbBtcLendingApy = (await fetch(
    `${BRIAN_API_BASE_URL}/api/v0/agent/transaction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-brian-api-key": `${process.env.BRIAN_API_KEY}`,
      },
      body: JSON.stringify({
        prompt:
          "Give me investment advice for cbbtc on base with liquidity > 20 milions on aave",
        address: userAddress,
      }),
    }
  ).then((res) => res.json())) as TransactionResponse;

  return {
    baseEth: {
      description: baseEthLendingApy.result[0].data.description,
      chainId: baseEthLendingApy.result[0].data.fromChainId,
    },
    baseCbBtc: {
      description: baseCbBtcLendingApy.result[0].data.description,
      chainId: baseCbBtcLendingApy.result[0].data.fromChainId,
    },
  };
};

export const getDepositStrategy = async ({
  userAddress,
  amount,
  strategy,
  userRiskProfile,
}: DepositParams): Promise<StrategyResponse> => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    //if strategy is 2 and userRiskProfile is populated, make a call to the llm to get the right strategy id (2 or 3)
    if (strategy === 2 && userRiskProfile.length > 0) {
      const riskProfileResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: populateSystemTemplateForProfiling(
              userRiskProfile,
              amount
            ),
          },
        ],
      });
      // Clean and parse the response
      const cleanRiskProfileContent = riskProfileResponse.choices[0].message
        .content!.replace(/```json\n?/, "")
        .replace(/```/, "")
        .trim();
      const parsedRiskProfileResponse = JSON.parse(cleanRiskProfileContent);
      console.log(parsedRiskProfileResponse, "parsedRiskProfileResponse");
      strategy = parsedRiskProfileResponse.strategy;
      if (strategy !== 2 && strategy !== 3) {
        return {
          success: false,
          error: "Invalid strategy selected",
        };
      }
    }

    let strategies: string;

    switch (strategy) {
      case 1: {
        // 100% stable cross-chain
        const crossChainResults = await findStableLiquidityCross(userAddress);
        strategies = `Available stable pools: ${crossChainResults.baseStrategy.description} (Chain ${crossChainResults.baseStrategy.chainId}).`;
        console.log(strategies, "strategies");
        break;
      }
      case 2: {
        // 50% stable cross-chain, 50% single
        const crossChainResults = await findStableLiquidityCross(userAddress);
        const singleResults = await findLiquiditySingle(userAddress);
        strategies = `Available stable pools: ${crossChainResults.baseStrategy.description} (Chain ${crossChainResults.baseStrategy.chainId}). Available volatile pools: ETH pool - ${singleResults.baseEth.description} (Chain ${singleResults.baseEth.chainId}), cbBTC pool - ${singleResults.baseCbBtc.description} (Chain ${singleResults.baseCbBtc.chainId})`;
        console.log(strategies, "strategies");
        break;
      }
      case 3: {
        // 20% stable cross-chain, 80% single
        const crossChainResults = await findStableLiquidityCross(userAddress);
        const singleResults = await findLiquiditySingle(userAddress);
        strategies = `Available stable pools: ${crossChainResults.baseStrategy.description} (Chain ${crossChainResults.baseStrategy.chainId}). Available volatile pools: ETH pool - ${singleResults.baseEth.description} (Chain ${singleResults.baseEth.chainId}), cbBTC pool - ${singleResults.baseCbBtc.description} (Chain ${singleResults.baseCbBtc.chainId})`;
        console.log(strategies, "strategies");
        break;
      }
      default:
        return {
          success: false,
          error: "Invalid strategy selected",
        };
    }

    //

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: populateSystemTemplate(
            strategy.toString(),
            amount,
            strategies
          ),
        },
      ],
    });

    // Clean and parse the response
    const cleanContent = response.choices[0].message
      .content!.replace(/```json\n?/, "")
      .replace(/```/, "")
      .trim();

    try {
      const parsedResponse = JSON.parse(cleanContent);
      console.log(parsedResponse, "parsedResponse");

      // Join strategies with "and then"
      const strategyDescriptions = parsedResponse.strategies
        .map((s: { description: string }) => s.description)
        .join(" and then ");
      console.log(strategyDescriptions, "strategyDescriptions");
      const strategyTx = (await fetch(
        `${BRIAN_API_BASE_URL}/api/v0/agent/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-brian-api-key": `${process.env.BRIAN_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: strategyDescriptions,
            address: userAddress,
          }),
        }
      ).then((res) => res.json())) as TransactionResponse;
      console.log(strategyTx, "strategyTx");

      // Map each result to the desired format
      const transactions = strategyTx.result.map((item) => ({
        strategy,
        details: item.data.description,
        data: item.data.steps?.[item.data.steps.length - 1].data,
        chainId: item.data.fromChainId || 0,
        tokenAddress: item.data.fromToken?.address as `0x${string}`,
        tokenAmount: Number(item.data.fromAmount) || 0,
      }));
      console.log(transactions, "transactions");
      console.log(transactions.length, "transactions.length");

      return {
        success: true,
        data: {
          transactions,
          totalTransactions: transactions.length,
        },
      };
    } catch (parseError) {
      console.error(
        "JSON parsing error:",
        parseError,
        "Raw content:",
        cleanContent
      );
      throw new Error("Failed to parse strategy response");
    }
  } catch (error) {
    console.error("Strategy execution error:", error);
    return {
      success: false,
      error: "Failed to execute deposit strategy",
    };
  }
};

export const systemTemplate = `
You are an AI agent helping users invest their USDC according to their risk tolerance and goals.
The user has selected strategy {risk_level} and has {amount} USDC to invest.

Available strategies:
{strategies}

Strategy rules:
- Strategy 1: Distribute 100% of funds across stable pools (can use one or multiple pools). Only use pools on Base.
- Strategy 2: Distribute exactly 50% to stable pools and 50% across ETH and/or cbBTC pools. Only use pools on Base.
- Strategy 3: Distribute exactly 20% to stable pools and 80% across ETH and/or cbBTC pools. Only use pools on Base.

For stable pools, prefer to not split the amount between pools if the APY is little higher and the liquidity is similar.
For ETH/cbBTC pools the action is a swap from usdc to the output protocol token, don't consider the protocol name in the response.

Respond with a raw JSON object in this exact format (no markdown, no code blocks):
{
  "strategies": [
    {
      "description": "deposit X usdc to protocolName on chainName"
    }
  ]
}
or in case of ETH/cbBTC pools:
{
  "strategies": [
    {
      "description": "swap X usdc to protocolToken on chainName"
    }
  ]
}

Each strategy must be a single deposit or swap action (if not stable pools). The sum of all deposits must equal {amount}.
`;

export const systemTemplateForProfiling = `
You are an AI agent helping users invest their USDC according to their risk tolerance and goals.
The user has provided the following info when replying to my questions: {risk_profile} and has {amount} USDC to invest.

Available strategies:
2 - medium risk. 50% stable, 50% volatile
3 - high risk. 20% stable, 80% volatile

Respond with a raw JSON object in this exact format (no markdown, no code blocks):
{
  "strategy": 2
}

`;

//function to populate the system template with the actual values
const populateSystemTemplate = (
  riskLevel: string,
  amount: number,
  strategies: string
) => {
  return systemTemplate
    .replace("{risk_level}", riskLevel)
    .replace("{amount}", amount.toString())
    .replace("{strategies}", strategies);
};

const populateSystemTemplateForProfiling = (
  userRiskProfile: string[],
  amount: number
) => {
  return systemTemplateForProfiling
    .replace("{risk_profile}", userRiskProfile.join(", "))
    .replace("{amount}", amount.toString());
};
