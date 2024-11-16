import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import { getEnsAddress } from "./ens";
import { privateKeyToAccount } from "viem/accounts";
import { environment } from "../config/environment";

export const createAttestation = async (data: {
  referredENS: string;
  referrerENS: string;
}) => {
  const agentAccount = privateKeyToAccount(
    environment.AGENT_PRIVATE_KEY as `0x${string}`
  );
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.base,
    account: agentAccount,
  });
  const referrerAddress = await getEnsAddress(data.referrerENS);
  const referredAddress = await getEnsAddress(data.referredENS);
  const createAttestationRes = await client.createAttestation({
    schemaId: "0x77",
    data: {
      referrer: referrerAddress,
      referred: referredAddress,
      referrerENS: data.referrerENS,
      referredENS: data.referredENS,
      createdAt: Date.now(),
    },
    indexingValue: "xxx",
    attester: agentAccount.address,
    recipients: [referredAddress!],
  });
};
