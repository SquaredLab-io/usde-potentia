import { useAccount, useWalletClient } from "wagmi";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { AllPositions } from "@squaredlab-io/sdk/src/interfaces/index.interface";
// import notification from "@components/common/notification";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { REFETCH_INTERVAL } from "@lib/constants";
import { useTradeStore } from "@store/tradeStore";

interface PropsType {
  paused?: boolean;
}

interface ReturnType {
  openOrders: AllPositions | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AllPositions | undefined, Error>>;
}

/**
 *
 * @param paused Pause the auto fetching
 * @returns openOrders, isFetching, getOpenOrders
 */
export function useOpenOrders({ paused = false }: PropsType = {}): ReturnType {
  // wallet info hooks
  const { address } = useAccount();
  const { status } = useWalletClient();
  // initiating sdk
  const { potentia } = usePotentiaSdk();

  const { closePopoverDisabled } = useTradeStore();

  const getOpenOrders = async () => {
    try {
      return await potentia?.openOrders();
    } catch (error) {
      console.error("Failed to fetch open orders\n", error);
    }
  };

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["openOrders", address],
    queryFn: getOpenOrders,
    refetchInterval: closePopoverDisabled ? false : REFETCH_INTERVAL,
    enabled:
      !paused && potentia !== undefined && address !== undefined && status === "success",
    staleTime: 0, // data is treated stale immediatly after fetching
    gcTime: 0, // cache is moved to grabage collector immediatly after it's not in use
    retry: 4,
    refetchOnReconnect: !closePopoverDisabled,
    refetchOnMount: !closePopoverDisabled,
    refetchOnWindowFocus: false
  });

  return {
    openOrders: data,
    isFetching,
    refetch: refetch
  } satisfies ReturnType;
}
