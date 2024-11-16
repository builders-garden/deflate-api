import openai, { OpenAI } from "openai";
import { environment } from "../../config/environment";

interface DepositParams {
  userAddress: string;
  amount: number;
  strategy: number;
}

interface StrategyResponse {
  success: boolean;
  data?: {
    data?: string;
    strategy: number;
    details: string;
    chainId: number;
  };
  error?: string;
}

export const getDepositStrategy = async ({
  userAddress,
  amount,
  strategy,
}: DepositParams): Promise<StrategyResponse> => {
  try {
    const openai = new OpenAI({
      apiKey: environment.OPENAI_API_KEY!,
    });

    switch (strategy) {
      case 1:
        //fetch usdc lending APY on Base and Polygon
        const baseUsdcLendingApy = (await fetch(
          "https://api.brian.app/v1/transact",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${environment.BRIAN_API_KEY}`,
            },
            body: JSON.stringify({
              prompt:
                "Give me investment advice for USDC on Base with liquidity > 5 milions",
              address: userAddress,
            }),
          }
        ).then((res) => res.json())) as Promise<any>;
        console.log(baseUsdcLendingApy, "baseUsdcLendingApy");
        const baseUsdcLendingApyDescription = (await baseUsdcLendingApy)[0].data
          .description;
        console.log(
          baseUsdcLendingApyDescription,
          "baseUsdcLendingApyDescription"
        );

        //fetch usdc lending APY on Base and Polygon
        const polygonUsdcLendingApy = (await fetch(
          "https://api.brian.app/v1/transact",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${environment.BRIAN_API_KEY}`,
            },
            body: JSON.stringify({
              prompt:
                "Give me investment advice for USDC on Polygon with liquidity > 5 milions",
              address: userAddress,
            }),
          }
        ).then((res) => res.json())) as Promise<any>;

        const polygonUsdcLendingApyDescription = (
          await polygonUsdcLendingApy
        )[0].data.description;

        const strategies =
          baseUsdcLendingApyDescription + polygonUsdcLendingApyDescription;
        console.log(strategies, "strategies");

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

        const strategyDescription = JSON.parse(
          response.choices[0].message.content!
        ).strategies[0].description;
        console.log(strategyDescription, "strategyDescription");

        const strategyTx = (await fetch("https://api.brian.app/v1/transact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${environment.BRIAN_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: strategyDescription,
            address: userAddress,
          }),
        }).then((res) => res.json())) as Promise<any>;

        console.log(strategyTx, "strategyTx");

        const strategyTxData = (await strategyTx)[0].data.steps?.[
          (await strategyTx)[0].data.steps.length - 1
        ].data;
        const chainId = (await strategyTx)[0].data.fromChainId;

        // Strategy 1: Direct USDC deposit to Aave
        return {
          success: true,
          data: {
            strategy: 1,
            details: strategyDescription,
            data: strategyTxData,
            chainId: chainId!,
          },
        };

      case 2: {
        // Fetch APY data for both protocols
        const aaveData = (await fetch("https://api.brian.app/v1/transact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${environment.BRIAN_API_KEY}`,
          },
          body: JSON.stringify({
            prompt:
              "Give me investment advice for USDC on Aave with liquidity > 5 millions",
            address: userAddress,
          }),
        }).then((res) => res.json())) as Promise<any>;

        const compoundData = (await fetch("https://api.brian.app/v1/transact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${environment.BRIAN_API_KEY}`,
          },
          body: JSON.stringify({
            prompt:
              "Give me investment advice for USDC on Compound with liquidity > 5 millions",
            address: userAddress,
          }),
        }).then((res) => res.json())) as Promise<any>;

        const strategies =
          (await aaveData)[0].data.description +
          (await compoundData)[0].data.description;

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

        const strategyDescription = JSON.parse(
          response.choices[0].message.content!
        ).strategies[0].description;

        const strategyTx = (await fetch("https://api.brian.app/v1/transact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${environment.BRIAN_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: strategyDescription,
            address: userAddress,
          }),
        }).then((res) => res.json())) as Promise<any>;

        const strategyTxData = (await strategyTx)[0].data.steps?.[
          (await strategyTx)[0].data.steps.length - 1
        ].data;
        const chainId = (await strategyTx)[0].data.fromChainId;

        return {
          success: true,
          data: {
            strategy: 2,
            details: strategyDescription,
            data: strategyTxData,
            chainId: chainId!,
          },
        };
      }

      case 3: {
        // Fetch APY data across multiple protocols and chains
        const [highYieldData, stableYieldData] = await Promise.all([
          fetch("https://api.brian.app/v1/transact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${environment.BRIAN_API_KEY}`,
            },
            body: JSON.stringify({
              prompt:
                "Give me highest yield investment opportunities for USDC across all supported protocols",
              address: userAddress,
            }),
          }).then((res) => res.json()) as Promise<any>,
          fetch("https://api.brian.app/v1/transact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${environment.BRIAN_API_KEY}`,
            },
            body: JSON.stringify({
              prompt:
                "Give me stable yield farming strategies for USDC with minimum risk",
              address: userAddress,
            }),
          }).then((res) => res.json()) as Promise<any>,
        ]);

        const strategies = `${highYieldData[0].data.description} ${stableYieldData[0].data.description}`;

        const openai = new OpenAI({
          apiKey: environment.OPENAI_API_KEY!,
        });

        //OpenAI call to get the strategy description
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

        const strategyDescription = JSON.parse(
          response.choices[0].message.content!
        );
        console.log(strategyDescription, "strategyDescription");
        console.log(
          strategyDescription.strategies,
          "strategyDescription.strategies"
        );
        console.log(
          strategyDescription.strategies.length,
          "strategyDescription.strategies.length"
        );

        const strategyTx = (await fetch("https://api.brian.app/v1/transact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${environment.BRIAN_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: strategyDescription,
            address: userAddress,
          }),
        }).then((res) => res.json())) as Promise<any>;

        const strategyTxData = (await strategyTx)[0].data.steps?.[
          (await strategyTx)[0].data.steps.length - 1
        ].data;
        const chainId = (await strategyTx)[0].data.fromChainId;

        return {
          success: true,
          data: {
            strategy: 3,
            details: strategyDescription,
            data: strategyTxData,
            chainId: chainId!,
          },
        };
      }

      default:
        return {
          success: false,
          error: "Invalid strategy selected",
        };
    }
  } catch (error) {
    console.error("Strategy execution error:", error);
    return {
      success: false,
      error: "Failed to execute deposit strategy",
    };
  }
};

//system template for the strategy description
export const systemTemplate = `

    you are a AI agent that is helping users to invest their USDC according to their risk tolerance and goals.
    We provide 3 risk levels: low, medium, high. The user risk level is {risk_level}. The user has {amount} USDC to invest.
    These are the available strategies on Base and Polygon:
    {strategies}
    Choose the best or multiple optimal strategies for the user and return the strategy description like this:
    "deposit {amount} USDC to strategyProtocol on {chain} " or "deposit {amount} USDC to strategyProtocol on {chain} and deposit {amount} USDC to strategyProtocol on {chain}". An example of a strategy description is: 
    "deposit 1000 USDC to aave on Polygon" or "deposit 1000 USDC to aave on Polygon and deposit 1000 USDC to compound on Base".
    Your response should be in JSON format like this (if there is only one strategy, the array will have only one element):
    { 
      "strategies": [
        {
          "description": "deposit 1000 USDC to aave on Polygon"
        },
        {
          "description": "deposit 1000 USDC to aave on Polygon and deposit 1000 USDC to compound on Base"
        }
      ]
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
