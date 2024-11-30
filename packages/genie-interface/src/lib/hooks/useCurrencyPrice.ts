import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { getTokenSymbol, POOL_ID_MAP } from "@lib/utils/pools";
import { REFETCH_INTERVAL } from "@lib/constants";
import { makeMarketDataApiRequest } from "@lib/apis";

interface MarketData {
  current_price: number;
  market_cap: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number;
  total_volume: number;
  max_supply: number;
}

interface ReturnType {
  price: number;
  marketData: MarketData | undefined;
  isMarketDataLoading: boolean;
  _symbol: PoolSymbol;
  refetchMarketData: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<MarketData | undefined, Error>>;
}

type PoolSymbol = keyof typeof POOL_ID_MAP | "";

export function useCurrencyPrice(symbol = ""): ReturnType {
  const _symbol = getTokenSymbol(symbol) as PoolSymbol;

  const fetchMarketData = async () => {
    if (_symbol === "") {
      console.error("No mapping found");
      return;
    }
    try {
      const result = await makeMarketDataApiRequest(
        `coins/markets?vs_currency=usd&ids=${POOL_ID_MAP[_symbol].id}&price_change_percentage=24h`
      );
      const {
        current_price,
        market_cap,
        high_24h,
        low_24h,
        price_change_percentage_24h,
        total_volume,
        max_supply
      } = result[0];
      return {
        current_price,
        market_cap,
        high_24h,
        low_24h,
        price_change_percentage_24h,
        total_volume,
        max_supply
      } as MarketData;
    } catch (error) {
      console.error("Error while fetching market data");
    }
  };

  // all the market data
  const {
    data: marketData,
    isFetching: isMarketDataLoading,
    refetch: refetchMarketData
  } = useQuery({
    queryKey: ["marketData", symbol],
    queryFn: fetchMarketData,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!symbol
  });

  return {
    price: marketData?.current_price ?? 0,
    marketData,
    isMarketDataLoading,
    refetchMarketData,
    _symbol
  } satisfies ReturnType;
}
