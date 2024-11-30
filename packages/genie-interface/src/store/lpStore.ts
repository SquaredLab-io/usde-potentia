import { create } from "zustand";
import { LpTradeOptions } from "@lib/types/enums";
import { GraphOptions } from "@components/PoolOverview/helper";

interface iLp {
  lpTradeOption: LpTradeOptions;
  setLpTradeOption: (value: LpTradeOptions) => void;
  lpGraphOption: GraphOptions;
  setLpGraphOption: (value: GraphOptions) => void;
}

export const useLpStore = create<iLp>((set, get) => ({
  lpTradeOption: LpTradeOptions.supply,
  setLpTradeOption: (value) =>
    set(() => ({
      lpTradeOption: value
    })),
  lpGraphOption: GraphOptions.volume,
  setLpGraphOption: (value) =>
    set(() => ({
      lpGraphOption: value
    }))
}));
