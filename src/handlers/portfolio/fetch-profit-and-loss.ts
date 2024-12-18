import { Request, Response } from "express";
import {
  fetchProfitAndLossData,
  ONE_INCH_TIMERANGE,
} from "../../services/1inch";
import { PLACEHOLDER_ADDRESS } from "../../utils/constants";

export const fetchProfitAndLoss = async (req: Request, res: Response) => {
  const user = req.user!;
  const timerange = req.query.timerange as ONE_INCH_TIMERANGE;
  const walletAddress = user.linkedAccounts.find(
    (account) => account.type === "wallet"
  )?.address;
  const profitAndLossData = await fetchProfitAndLossData(
    PLACEHOLDER_ADDRESS,
    timerange
  );
  res.json({
    data: profitAndLossData.result.find((i) => !i.chain_id),
  });
};
