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
  createNexusSessionClient,
  Execution,
} from "@biconomy/sdk";
import {
  Chain,
  ClientConfig,
  EIP1193RequestFn,
  Hex,
  http,
  TransportConfig,
} from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount, toAccount } from "viem/accounts";
import { environment } from "../config/environment";

export const sendTransactionWithSession = async (
  sessionData: SessionData,
  calls: Execution[]
) => {
  try {
    console.log("----- sessionData", sessionData);
    const agentAccount = privateKeyToAccount(
      environment.AGENT_PRIVATE_KEY as `0x${string}`
    );

    const paymasterClient = createBicoPaymasterClient({
      transport: http(environment.BICONOMY_BASE_PAYMASTER_URL),
    });

    const nexusClient = await createNexusClient({
      accountAddress: sessionData.granter,
      signer: agentAccount,
      chain: base,
      transport: http(),
      bundlerTransport: http(environment.BICONOMY_BASE_BUNDLER_URL),
      paymaster: paymasterClient,
      paymasterContext: {
        mode: "SPONSORED",
        expiryDuration: 300,
        calculateGasLimits: true,
        sponsorshipInfo: {
          smartAccountInfo: {
            name: "BICONOMY",
            version: "2.0.0",
          },
        },
      },
    });

    const usePermissionsModule = toSmartSessionsValidator({
      account: nexusClient.account,
      signer: agentAccount,
      moduleData: {
        permissionId: sessionData.moduleData.permissionId as Hex,
      },
    });

    // Create base nexus client
    const nexusSessionClient = await createNexusSessionClient({
      signer: agentAccount,
      accountAddress: sessionData.granter,
      chain: base,
      transport: http(),
      bundlerTransport: http(environment.BICONOMY_BASE_BUNDLER_URL),
      paymaster: paymasterClient,
      paymasterContext: {
        mode: "SPONSORED",
        expiryDuration: 300,
        calculateGasLimits: true,
        sponsorshipInfo: {
          smartAccountInfo: {
            name: "BICONOMY",
            version: "2.0.0",
          },
        },
      },
      module: usePermissionsModule,
    });

    // Install the module
    const useSmartSessionNexusClient = nexusSessionClient.extend(
      smartSessionUseActions(usePermissionsModule)
    );
    const userOpHash = await useSmartSessionNexusClient.usePermission({
      actions: calls,
    });
    return useSmartSessionNexusClient;
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error("Failed to initialize smart account");
  }
};
