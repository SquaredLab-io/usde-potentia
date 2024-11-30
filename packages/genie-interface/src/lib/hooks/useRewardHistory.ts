import { useWalletClient } from "wagmi";
import { Address } from "viem";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { RewardHistoryReturnType } from "@squaredlab-io/sdk/src/interfaces/ponder.interface";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { REFETCH_INTERVAL } from "@lib/constants";

interface PropsType {
  address: Address | undefined;
  paused?: boolean;
}

export interface RewardHistoryType {
  rewardHistory: RewardHistoryReturnType | undefined;
  isFetching: boolean;
  isPending: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<RewardHistoryReturnType | undefined, Error>>;
}

export function useRewardHistory({
  address,
  paused = false
}: PropsType): RewardHistoryType {
  const { status } = useWalletClient();
  const { potentia } = usePotentiaSdk();

  const getRewardHistory = async () => {
    try {
      const _rew = await potentia?.ponderClient.getRewardHistory(address!);
      console.log('_rew', _rew);
      return _rew;
    } catch (error) {
      console.error("Failed to fetch reward history\n", error);
    }
  };

  const { data, isFetching, isPending, refetch } = useQuery({
    queryKey: ["rewardHistory", address],
    queryFn: getRewardHistory,
    refetchInterval: REFETCH_INTERVAL,
    enabled:
      !paused && potentia !== undefined && address !== undefined && status === "success",
    staleTime: 10000,
    gcTime: 30000,
    retry: 4
  });

  return {
    rewardHistory: data,
    isFetching,
    isPending,
    refetch
  } satisfies RewardHistoryType;
}
