import { create } from "zustand";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { PoolMapping } from "@lib/hooks/usePools";

interface iPools {
  poolsData: PoolInfo[];
  poolMap: Record<string, PoolMapping> | undefined;
  selectedPool: () => PoolInfo | undefined;
  isFetchingPools: boolean;
  updatePoolsData: (value: PoolInfo[] | undefined) => void;
  updatePoolMap: (value: Record<string, PoolMapping> | undefined) => void;
  updateSelectedPool: (value: PoolInfo) => void;
  updateIsFetchingPools: (value: boolean) => void;
}

export const usePoolsStore = create<iPools>((set, get) => ({
  poolsData: [],
  poolMap: undefined,
  // selectedPool: () => {
  //   const state = get();
  //   return state.poolsData?.[state.poolsData.length - 1];
  // },
  selectedPool: () => {
    return undefined;
  },
  isFetchingPools: false,
  // actions
  updatePoolsData: (pools) =>
    set(() => ({
      poolsData: pools
    })),
  updatePoolMap: (newMap) =>
    set(() => ({
      poolMap: newMap
    })),
  updateSelectedPool: (newPool) => {
    set(() => ({
      selectedPool: () => newPool
    }));
  },
  updateIsFetchingPools: (isFetching) => {
    set(() => ({
      isFetchingPools: isFetching
    }));
  }
}));

interface iPoolModalStore {
  openCreateTokenModal: boolean;
  setOpenCreateTokenModal: (value: boolean) => void;
  openCreateModal: boolean;
  setOpenCreateModal: (value: boolean) => void;
  openManageModal: boolean;
  setOpenManageModal: (value: boolean) => void;
  openOverviewModal: boolean;
  setOpenOverviewModal: (value: boolean) => void;
  openSelectPoolOverviewModal: boolean;
  setOpenSelectPoolOverviewModal: (value: boolean) => void;
  openTokenSelectorModal: boolean;
  setOpenTokenSelectorModal: (value: boolean) => void;
  openReferralModal: boolean;
  setOpenReferralModal: (value: boolean) => void;
}

export const useModalStore = create<iPoolModalStore>((set, get) => ({
  openCreateTokenModal: false,
  setOpenCreateTokenModal: (value) => {
    set(() => ({
      openCreateTokenModal: value
    }));
  },
  openCreateModal: false,
  setOpenCreateModal: (value) => {
    set(() => ({
      openCreateModal: value
    }));
  },
  openManageModal: false,
  setOpenManageModal: (value: boolean) => {
    set(() => ({
      openManageModal: value
    }));
  },
  openOverviewModal: false,
  setOpenOverviewModal: (value: boolean) => {
    set(() => ({
      openOverviewModal: value
    }));
  },
  openSelectPoolOverviewModal: false,
  setOpenSelectPoolOverviewModal: (value: boolean) => {
    set(() => ({
      openSelectPoolOverviewModal: value
    }));
  },
  openTokenSelectorModal: false,
  setOpenTokenSelectorModal: (value: boolean) => {
    set(() => ({
      openTokenSelectorModal: value
    }));
  },
  openReferralModal: false,
  setOpenReferralModal: (value: boolean) => {
    set(() => ({
      openReferralModal: value
    }));
  }
}));
