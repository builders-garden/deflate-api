import { createPublicClient, http } from "viem";
import { normalize } from "viem/ens";
import { base } from "viem/chains";

export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export const getEnsAddress = async (ensName: string) => {
  const ensAddress = await publicClient.getEnsAddress({
    name: normalize(ensName),
  });
  return ensAddress;
};
