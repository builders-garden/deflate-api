import { Request, Response } from "express";
import { fetchValueChartData, ONE_INCH_TIMERANGE } from "../../services/1inch";
import { PLACEHOLDER_ADDRESS } from "../../utils/constants";

export const fetchValueChart = async (req: Request, res: Response) => {
  const user = req.user!;
  const timerange = req.query.timerange as ONE_INCH_TIMERANGE;
  const walletAddress = user.linkedAccounts.find(
    (account) => account.type === "wallet"
  )?.address;
  const valueChart = await fetchValueChartData(PLACEHOLDER_ADDRESS, timerange);
  res.json({
    data: valueChart.result,
  });
};
