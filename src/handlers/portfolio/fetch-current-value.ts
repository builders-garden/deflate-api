import { PLACEHOLDER_ADDRESS } from './../../utils/constants';
import { Request, Response } from "express";
import { fetchCurrentValueData } from "../../services/1inch";

export const fetchCurrentValue = async (req: Request, res: Response) => {
  const user = req.user!;
  const walletAddress = user.linkedAccounts.find(
    (account) => account.type === "wallet"
  )?.address;
  const currentValue = await fetchCurrentValueData(PLACEHOLDER_ADDRESS);
  res.json({data: currentValue.result[0].value_usd});
};
