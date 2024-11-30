import { PoolInfo } from "@squaredlab-io/sdk";
import { makeMarketDataApiRequest } from "@lib/apis";
import { getTokenSymbol, POOL_ID_MAP } from "@lib/utils/pools";

export interface PoolOverviewData {
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

type PoolSymbol = keyof typeof POOL_ID_MAP;

const getPoolsMarketData = async (pools: PoolInfo[] | undefined) => {
  if (!pools) return [];
  const uniqueUnderlyings = Array.from(new Set(pools.map((pool) => pool.underlying)));
  const promiseResults = await Promise.all(
    uniqueUnderlyings.map(async (underlying) => {
      const symbol = getTokenSymbol(underlying) as PoolSymbol;
      const response = await makeMarketDataApiRequest(
        `coins/markets?vs_currency=usd&ids=${POOL_ID_MAP[symbol].id}&price_change_percentage=24h`
      );
      const data: PoolOverviewData = response[0];
      return {
        underlying_symbol: underlying,
        current_price: data.current_price,
        price_change_percentage_24h: data.price_change_percentage_24h,
        total_volume: data.total_volume
      };
    })
  );
  return promiseResults;
};

export default getPoolsMarketData;
