import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { useAccount } from "wagmi";
import { MyPoolInfo } from "@lib/types/pools";
import { useMemo } from "react";
import { PoolInfo } from "@squaredlab-io/sdk";

interface ReturnType {
  myPools: PoolInfo[] | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<MyPoolInfo[] | undefined, Error>>;
}

export function useMyPools(allPools: PoolInfo[] | undefined, paused = false): ReturnType {
  const { potentia } = usePotentiaSdk();
  const { address } = useAccount();

  const getMyPools = async () => {
    try {
      const data = await potentia?.ponderClient.getMyPools(address!);
      return data?.pools;
    } catch (error) {
      console.error("Failed to fetch pools.");
    }
  };

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["genie_my_pools", address],
    queryFn: getMyPools,
    refetchInterval: false,
    enabled: !paused && !!potentia && !!address
  });

  const _myPools = useMemo(() => {
    if (!allPools || !data) return undefined;
    else if (allPools.length === 0 || data.length === 0) return new Array<PoolInfo>();

    // Create a Set of poolAddr values from mypools for efficient lookup
    const myPoolAddresses = new Set(data.map((mypool) => mypool.pool));
    // Filter the pools array
    return allPools.filter((pool) => myPoolAddresses.has(pool.poolAddr));
  }, [allPools, data]);

  return {
    myPools: _myPools,
    isFetching,
    refetch
  } satisfies ReturnType;
}
