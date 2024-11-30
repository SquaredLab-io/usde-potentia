import { useQuery, QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { UserPoint } from "@squaredlab-io/sdk/src/interfaces/ponder.interface";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { REFETCH_INTERVAL } from "@lib/constants";

interface PropsType {
  paused?: boolean;
}

export interface LeaderboardType {
  ranks: UserPoint[] | undefined;
  isFetching: boolean;
  isPending: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<UserPoint[] | undefined, Error>>;
}

export function useLeaderboard({ paused = false }: PropsType = {}): LeaderboardType {
  const { potentia } = usePotentiaSdk();
  const getLeaderboard = async () => {
    try {
      return await potentia?.ponderClient.getRanks();
    } catch (error) {
      console.error("Failed to fetch leaderboard\n", error);
    }
  };

  const { data, isFetching, isPending, refetch } = useQuery({
    queryKey: ["leaderboard"], // independent of any extra key
    queryFn: getLeaderboard,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !paused && potentia !== undefined,
    staleTime: 10000,
    gcTime: 30000,
    retry: 4,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  return {
    ranks: data,
    isFetching,
    isPending,
    refetch
  } satisfies LeaderboardType;
}
