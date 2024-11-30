import { Address, getAddress } from "viem";
import { useAccount } from "wagmi";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { usePoolsStore } from "@store/poolsStore";
import { Tx } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { REFETCH_INTERVAL } from "@lib/constants";

type ReturnTxHistory = {
  data: Tx[] | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Tx[] | undefined, Error>>;
};

/**
 * useTradeHistory hook fetches connected account's all liquidity transaction history
 * @returns data, isLoading, refetch
 */
export function useLiquidityHistory(paused = false): ReturnTxHistory {
  const { selectedPool } = usePoolsStore();
  const { potentia } = usePotentiaSdk();
  const { address } = useAccount();

  async function getLiquidityHistory() {
    try {
      const result = await potentia?.getUserLiquidityHistory(
        address as Address // user
      );
      return result;
    } catch (error) {
      console.error("Error -- fetching liquidity history", error);
    }
  }

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["liquidityHistory", selectedPool()?.underlying, address],
    queryFn: getLiquidityHistory,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !paused && !!selectedPool() && !!address && !!potentia
    // staleTime: 0,
    // gcTime: 0
  });

  return { data, isFetching, refetch };
}
