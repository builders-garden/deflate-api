import { Request, Response } from "express";
import {
    fetchCurrentValueData,
  fetchProfitAndLossData,
  fetchValueChartData,
  ONE_INCH_TIMERANGE,
} from "../../services/1inch";
import { PLACEHOLDER_ADDRESS } from "../../utils/constants";

export const fetchPortfolio = async (req: Request, res: Response) => {
  const user = req.user!;
  const timerange = req.query.timerange as ONE_INCH_TIMERANGE;
  const profitAndLoss = await fetchProfitAndLossData(
    PLACEHOLDER_ADDRESS,
    timerange
  );
  await new Promise((resolve) => setTimeout(resolve, 1100));
  const valueChart = await fetchValueChartData(PLACEHOLDER_ADDRESS, timerange);
  await new Promise((resolve) => setTimeout(resolve, 1100));
  const currentValue = await fetchCurrentValueData(PLACEHOLDER_ADDRESS);
  res.json({
    profitAndLoss: profitAndLoss.result.find((i) => !i.chain_id),
    valueChart: valueChart.result,
    currentValue: currentValue.result[0].value_usd,
  });
};
