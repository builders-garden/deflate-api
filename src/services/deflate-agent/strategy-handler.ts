import { BrianSDK } from "@brian-ai/sdk";
import openai, { OpenAI } from "openai";


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
      apiKey: process.env.OPENAI_API_KEY!,
    });

    switch (strategy) {
      case 1:
        //fetch usdc lending APY 
        const options = {
            apiKey: process.env.BRIAN_API_KEY!,
        };

        const brian = new BrianSDK(options);
        //fetch usdc lending APY on Base and Polygon
        const baseUsdcLendingApy = await brian.transact(
            {
                prompt: "Give me investment advice for USDC on Base with liquidity > 5 milions",
                address: userAddress,
            }
        )
        const baseUsdcLendingApyDescription = baseUsdcLendingApy[0].data.description
        //fetch usdc lending APY on Base and Polygon
        const poygonUsdcLendingApy = await brian.transact(
            {
                prompt: "Give me investment advice for USDC on Polygon with liquidity > 5 milions",
                address: userAddress,
            }
        )
        const poygonUsdcLendingApyDescription = poygonUsdcLendingApy[0].data.description

        const strategies = baseUsdcLendingApyDescription + poygonUsdcLendingApyDescription
        console.log(strategies, "strategies")

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: populateSystemTemplate(strategy.toString(), amount, strategies) }],
        });

        const strategyDescription = JSON.parse(response.choices[0].message.content!).strategies[0].description;
        console.log(strategyDescription, "strategyDescription")

        const strategyTx = await brian.transact({
            prompt: strategyDescription,
            address: userAddress,
        })

        console.log(strategyTx, "strategyTx")

        const strategyTxData = strategyTx[0].data.steps?.[strategyTx[0].data.steps.length - 1].data
        const chainId = strategyTx[0].data.fromChainId

        // Strategy 1: Direct USDC deposit to Aave
        return {
          success: true,
          data: {
            strategy: 1,
            details: strategyDescription,
            data: strategyTxData,
            chainId: chainId!
          }
        };

      case 2: {
        const options = {
          apiKey: process.env.BRIAN_API_KEY!,
        };
        const brian = new BrianSDK(options);
        
        // Fetch APY data for both protocols
        const aaveData = await brian.transact({
          prompt: "Give me investment advice for USDC on Aave with liquidity > 5 millions",
          address: userAddress,
        });
        
        const compoundData = await brian.transact({
          prompt: "Give me investment advice for USDC on Compound with liquidity > 5 millions",
          address: userAddress,
        });

        const strategies = aaveData[0].data.description + compoundData[0].data.description;
        
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: populateSystemTemplate(strategy.toString(), amount, strategies) }],
        });

        const strategyDescription = JSON.parse(response.choices[0].message.content!).strategies[0].description;
        
        const strategyTx = await brian.transact({
          prompt: strategyDescription,
          address: userAddress,
        });

        const strategyTxData = strategyTx[0].data.steps?.[strategyTx[0].data.steps.length - 1].data;
        const chainId = strategyTx[0].data.fromChainId;

        return {
          success: true,
          data: {
            strategy: 2,
            details: strategyDescription,
            data: strategyTxData,
            chainId: chainId!
          }
        };
      }

      case 3: {
        const options = {
          apiKey: process.env.BRIAN_API_KEY!,
        };
        const brian = new BrianSDK(options);
        
        // Fetch APY data across multiple protocols and chains
        const protocolQueries = await Promise.all([
          brian.transact({
            prompt: "Give me highest yield investment opportunities for USDC across all supported protocols",
            address: userAddress,
          }),
          brian.transact({
            prompt: "Give me stable yield farming strategies for USDC with minimum risk",
            address: userAddress,
          })
        ]);

        const strategies = protocolQueries.map(q => q[0].data.description).join(' ');

        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY!,
        });
        
        //OpenAI call to get the strategy description
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: populateSystemTemplate(strategy.toString(), amount, strategies) }],
        });

        const strategyDescription = JSON.parse(response.choices[0].message.content!)
        console.log(strategyDescription, "strategyDescription")
        console.log(strategyDescription.strategies, "strategyDescription.strategies")
        console.log(strategyDescription.strategies.length, "strategyDescription.strategies.length")
        
        const strategyTx = await brian.transact({
          prompt: strategyDescription,
          address: userAddress,
        });

        const strategyTxData = strategyTx[0].data.steps?.[strategyTx[0].data.steps.length - 1].data;
        const chainId = strategyTx[0].data.fromChainId;

        return {
          success: true,
          data: {
            strategy: 3,
            details: strategyDescription,
            data: strategyTxData,
            chainId: chainId!
          }
        };
      }

      default:
        return {
          success: false,
          error: "Invalid strategy selected"
        };
    }
  } catch (error) {
    console.error("Strategy execution error:", error);
    return {
      success: false,
      error: "Failed to execute deposit strategy"
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
`

//function to populate the system template with the actual values
const populateSystemTemplate = (riskLevel: string, amount: number, strategies: string) => {
    return systemTemplate.replace("{risk_level}", riskLevel).replace("{amount}", amount.toString()).replace("{strategies}", strategies);
}