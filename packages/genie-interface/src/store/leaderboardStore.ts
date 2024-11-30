import { create } from "zustand";
import { LeaderboardOptions } from "@components/Points/sections/helper";

interface iLeader {
  leaderboardTab: LeaderboardOptions;
  setLeaderboardTab: (value: LeaderboardOptions) => void;
}

/**
 * Deprecated -- leaderboardTab not in use
 */
export const useLeaderStore = create<iLeader>((set, get) => ({
  leaderboardTab: LeaderboardOptions.leaderboard,
  setLeaderboardTab: (value) =>
    set(() => ({
      leaderboardTab: value
    }))
}));
