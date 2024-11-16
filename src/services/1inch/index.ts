import { environment } from "../../config/environment";
import { ONE_INCH_API_BASE_URL } from "../../utils/constants";

export enum ONE_INCH_TIMERANGE {
  "1d" = "1d",
  "1week" = "1week",
  "1month" = "1month",
  "1year" = "1year",
}

export const fetchValueChartData = async (
  address: string,
  timerange: ONE_INCH_TIMERANGE
): Promise<{
  result: {
    timestamp: number;
    value_usd: number;
  }[];
}> => {
  const url = `${ONE_INCH_API_BASE_URL}/value_chart?addresses=${address}&timerange=${timerange}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${environment.ONE_INCH_API_KEY}`,
    },
  });
  const data = await response.json();
  return data as any;
};

export const fetchProfitAndLossData = async (
  address: string,
  timerange: ONE_INCH_TIMERANGE
): Promise<{
  result: {
    chain_id: number;
    abs_profit_usd: number;
    roi: number;
  }[];
}> => {
  const url = `${ONE_INCH_API_BASE_URL}/profit_and_loss?addresses=${address}&timerange=${timerange}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${environment.ONE_INCH_API_KEY}`,
    },
  });
  const data = await response.json();
  return data as any;
};

export const fetchCurrentValueData = async (
  address: string
): Promise<{
  result: {
    address: string;
    value_usd: number;
  }[];
}> => {
  const url = `${ONE_INCH_API_BASE_URL}/current_value?addresses=${address}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${environment.ONE_INCH_API_KEY}`,
    },
  });
  const data = await response.json();
  return data as any;
};
