import { formatNumber } from "@lib/utils/formatting";

export enum LeaderboardOptions {
  leaderboard = "leaderboard",
  stats = "stats"
}

export const formatTradeValue = (loading: boolean, value: string | undefined): string => {
  return loading ? "..." : value ? formatNumber(parseFloat(value), true) : "NA";
};
