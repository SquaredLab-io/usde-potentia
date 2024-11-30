import { QueryStatus, useQuery } from "@tanstack/react-query";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { REFETCH_INTERVAL } from "@lib/constants";
import { FundingInfo } from "@squaredlab-io/sdk";

interface PropsType {
  poolAddress: string | undefined;
  paused?: boolean;
}

export interface TokenPrice {
  lastLongP: string;
  longDailyChange: string;
  lastShortP: string;
  shortDailyChange: string;
  fundingInfo: FundingInfo;
  volume: string;
  dollarVol: string;
  tvl: string;
}

export interface ReturnType {
  tokenPrices: TokenPrice | undefined;
  isFetching: boolean;
  status: QueryStatus;
}

/**
 *
 * @param poolAddress
 * @param paused Pause the auto-fetching
 * @returns tokenPrices, isFetching, status
 */
export function useTokenPrice({ poolAddress, paused = false }: PropsType): ReturnType {
  const { potentia } = usePotentiaSdk();

  const fetchTokenPrice = async () => {
    try {
      const tokenprice = await potentia?.fetchTokenPrice(poolAddress!);
      return tokenprice;
    } catch (error) {
      console.error("Failed to fetch Token Prices\n", error);
    }
  };

  const {
    data,
    status,
    // error,
    // isError,
    isFetching: fetchingPrice
    // refetch
  } = useQuery({
    queryKey: ["tokenPrice", poolAddress],
    queryFn: fetchTokenPrice,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !paused && !!potentia && !!poolAddress,
    retry: 4
  });

  return {
    tokenPrices: data,
    isFetching: fetchingPrice,
    status
  } satisfies ReturnType;
}
