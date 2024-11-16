import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  IndexService,
} from "@ethsign/sp-sdk";
import { getEnsAddress } from "./ens";
import { privateKeyToAccount } from "viem/accounts";
import { environment } from "../config/environment";
import { createWalletClient, erc20Abi, http } from "viem";
import { base } from "viem/chains";
import { sendUsdc } from "./viem";

const agentAccount = privateKeyToAccount(
  environment.AGENT_PRIVATE_KEY as `0x${string}`
);

export const createAttestation = async (data: {
  referredENS: string;
  referrerENS: string;
}) => {
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
    indexingValue: `deflate-${referredAddress}`,
    attester: agentAccount.address,
    recipients: [referredAddress!],
  });
  await sendUsdc(referredAddress!, 1);
};

export const getAttestations = async (username: string) => {
  const indexService = new IndexService("mainnet");
  const referredAddress = await getEnsAddress(`${username}.deflateapp.eth`);
  return await indexService.queryAttestationList({
    schemaId: "onchain_evm_8453_0x77",
    attester: agentAccount.address,
    page: 1,
    mode: "onchain", // Data storage location
    indexingValue: `deflate-${referredAddress}`,
  });
};
