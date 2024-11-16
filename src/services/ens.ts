import { createPublicClient, createWalletClient, http } from "viem";
import { normalize } from "viem/ens";
import { base, mainnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { environment } from "../config/environment";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const getEnsAddress = async (ensName: string) => {
  const ensAddress = await publicClient.getEnsAddress({
    name: normalize(ensName),
  });
  return ensAddress;
};

export const registerEnsSubdomain = async (ensName: string) => {
  const account = privateKeyToAccount(
    environment.AGENT_PRIVATE_KEY! as `0x${string}`
  );
  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });
};
