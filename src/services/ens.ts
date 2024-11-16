import {
  createPublicClient,
  createWalletClient,
  http,
  labelhash,
  toHex,
} from "viem";
import { normalize, packetToBytes } from "viem/ens";
import { base, mainnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { environment } from "../config/environment";
import { DEFLATE_SUBDOMAIN_REGISTRAR_ABI } from "../utils/abis";
import { BASE_L2_REGISTRAR_ADDRESS } from "../utils/constants";

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

export const registerEnsSubdomain = async (
  username: string,
  owner: `0x${string}`
) => {
  const account = privateKeyToAccount(
    environment.AGENT_PRIVATE_KEY! as `0x${string}`
  );
  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });
  await walletClient.writeContract({
    address: BASE_L2_REGISTRAR_ADDRESS,
    abi: DEFLATE_SUBDOMAIN_REGISTRAR_ABI,
    functionName: "register",
    args: [normalize(username), owner],
  });
};
