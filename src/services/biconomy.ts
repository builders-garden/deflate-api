import {
  createNexusClient,
  toSmartSessionsValidator,
  smartSessionCreateActions,
  createBicoPaymasterClient,
  CreateSessionDataParams,
  NexusClient,
  ParamCondition,
  SessionData,
  smartSessionUseActions,
  Call,
} from "@biconomy/sdk";
import { Chain, encodeFunctionData, Hex, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { environment } from "../config/environment";

export const sendTransactionWithSession = async (
  sessionData: SessionData,
  calls: Call[]
) => {
  try {
    const agentAccount = privateKeyToAccount(
      environment.AGENT_PRIVATE_KEY as `0x${string}`
    );

    const paymasterClient = createBicoPaymasterClient({
      transport: http(environment.BICONOMY_BASE_PAYMASTER_URL),
    });

    // Create base nexus client
    const nexusClient = await createNexusClient({
      signer: agentAccount,
      accountAddress: sessionData.granter,
      chain: base,
      transport: http(),
      bundlerTransport: http(environment.BICONOMY_BASE_BUNDLER_URL),
      paymaster: paymasterClient,
    });

    const sessionsModule = toSmartSessionsValidator({
      account: nexusClient.account,
      signer: agentAccount,
    });

    // Install the module
    const useSmartSessionNexusClient = nexusClient.extend(
      smartSessionUseActions(sessionsModule)
    );
    const userOpHash = await useSmartSessionNexusClient.usePermission({
      calls,
    });
    return useSmartSessionNexusClient;
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error("Failed to initialize smart account");
  }
};
