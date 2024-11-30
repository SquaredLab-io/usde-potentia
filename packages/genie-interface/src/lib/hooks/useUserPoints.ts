import { useWalletClient } from "wagmi";
import { Address } from "viem";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { UserPointRank } from "@squaredlab-io/sdk/src/interfaces/ponder.interface";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { REFETCH_INTERVAL } from "@lib/constants";

interface PropsType {
  address: Address | undefined;
  paused?: boolean;
}

export interface UserPointsData {
  userPoints: UserPointRank | undefined;
  avgTradeSize: number | undefined;
}

export interface UserPointsType {
  userPointsData: UserPointsData | undefined;
  isFetching: boolean;
  isPending: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<UserPointsData | undefined, Error>>;
}

export function useUserPoints({ address, paused = false }: PropsType): UserPointsType {
  const { status } = useWalletClient();
  const { potentia } = usePotentiaSdk();

  const getUserPointsData = async () => {
    if (!potentia?.ponderClient || !address) return undefined;

    try {
      const [userPoints, avgTradeSize] = await Promise.all([
        potentia.ponderClient.getUserPoints(address),
        potentia.ponderClient.getTradeSizes(address)
      ]);
      return {
        userPoints,
        avgTradeSize
      };
    } catch (error) {
      console.error("Failed to fetch user points data\n", error);
    }
  };

  const { data, isFetching, isPending, refetch } = useQuery({
    queryKey: ["userPointsData", address],
    queryFn: getUserPointsData,
    refetchInterval: REFETCH_INTERVAL,
    enabled:
      !paused && potentia !== undefined && address !== undefined && status === "success",
    staleTime: 10000,
    gcTime: 30000,
    retry: 4
  });

  return {
    userPointsData: data,
    isFetching,
    isPending,
    refetch
  } satisfies UserPointsType;
}
