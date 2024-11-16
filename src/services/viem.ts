import { createWalletClient, erc20Abi, http } from "viem";
import { base } from "viem/chains";
import { BASE_USDC_ADDRESS } from "../utils/constants";
import { environment } from "../config/environment";
import { privateKeyToAccount } from "viem/accounts";

export const sendUsdc = async (to: `0x${string}`, amount: number) => {
  const account = privateKeyToAccount(
    environment.AGENT_PRIVATE_KEY! as `0x${string}`
  );
  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });
  await walletClient.writeContract({
    address: BASE_USDC_ADDRESS as `0x${string}`,
    abi: erc20Abi,
    functionName: "transfer",
    args: [to, BigInt(amount * 10 ** 6)],
  });
};
