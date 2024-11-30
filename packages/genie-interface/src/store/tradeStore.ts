import { create } from "zustand";
import { TradeOptions } from "@lib/types/enums";

interface iTrade {
  isPositionModalOpen: boolean;
  tradeType: string;
  closePopoverDisabled: boolean;
  setIsPositionModalOpen: (value: boolean) => void;
  setTradeType: (value: string) => void;
  setClosePopoverDisabled: (update: boolean) => void;
}

export const useTradeStore = create<iTrade>((set, get) => ({
  // states
  isPositionModalOpen: false,
  tradeType: TradeOptions.long,
  closePopoverDisabled: false,
  // actions
  setIsPositionModalOpen: (updatedState: boolean) =>
    set(() => ({
      isPositionModalOpen: updatedState
    })),
  setTradeType: (newTradeType: string) =>
    set(() => ({
      tradeType: newTradeType
    })),
  setClosePopoverDisabled: (update: boolean) =>
    set(() => ({
      closePopoverDisabled: update
    }))
}));
