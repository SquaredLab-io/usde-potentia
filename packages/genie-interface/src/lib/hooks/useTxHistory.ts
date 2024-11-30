import { useAccount } from "wagmi";
import { Address, getAddress } from "viem";
import { Tx } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { usePoolsStore } from "@store/poolsStore";
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
 * useTxHistory fetches connected user's Transaction history in the current Pool
 * @returns data, isLoading, refetch
 */
export function useTxHistory(paused = false): ReturnTxHistory {
  const { address } = useAccount();
  const { potentia } = usePotentiaSdk();

  const { selectedPool } = usePoolsStore();

  async function getTxHistory() {
    try {
      const result = await potentia?.getUserTxHistory(
        getAddress(selectedPool()?.poolAddr!), // pool
        address as Address // user
      );
      return result;
      // setTxHistory(result);
    } catch (error) {
      console.error("Error -- fetching transaction history", error);
    }
  }

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["userTxHistory", selectedPool()?.poolAddr, address],
    queryFn: getTxHistory,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !paused && !!selectedPool() && !!potentia && !!address,
    staleTime: 5000,
    gcTime: 30000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true
  });

  return { data, isFetching, refetch };
}
