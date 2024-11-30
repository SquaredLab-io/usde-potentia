import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { usePoolsStore } from "@store/poolsStore";
import { createPoolMapping, getSupportedPools } from "@lib/utils/pools";

export interface PoolMapping {
  power: number;
  underlying: string;
  underlyingAddress: string;
  decimals: number;
  poolAddr: string;
}

interface ReturnType {
  pools: PoolInfo[] | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<PoolInfo[] | undefined, Error>>;
  status: "error" | "success" | "pending";
}

export function usePools(paused = false): ReturnType {
  const { potentia } = usePotentiaSdk();

  // Using this poolsData for global instance
  const { updatePoolsData, updatePoolMap } = usePoolsStore();

  const getPools = async () => {
    try {
      const data = await potentia?.getPools();
      // console.log('fetched pools', data);
      const pools = getSupportedPools(data);
      updatePoolsData(pools);
      updatePoolMap(createPoolMapping(data));
      return pools;
    } catch (error) {
      console.error("Failed to fetch pools.");
    }
  };

  const { data, isFetching, refetch, status } = useQuery({
    queryKey: ["geniePools"],
    queryFn: getPools,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    // This sets the retry delay for failed queries using an exponential backoff strategy, doubling the delay each attempt
    // It caps the maximum delay at 30 seconds (30000ms)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !paused && !!potentia
  });

  return {
    pools: data,
    isFetching,
    refetch,
    status
  } satisfies ReturnType;
}
