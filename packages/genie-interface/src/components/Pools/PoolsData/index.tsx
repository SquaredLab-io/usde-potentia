"use client";

// Library Imports
import { useState } from "react";
import { TabsList } from "@radix-ui/react-tabs";
import { PlusIcon } from "lucide-react";
// Component Imports
import { Tabs, TabsContent, TabsTrigger } from "@components/ui/tabs";
import PoolsTable from "./PoolsTable";
import {
  allPoolsColumnDef,
  transactionsColumnDef,
  userPoolsColumnDef
} from "./pool-columns";
import SearchInput from "./SearchInput";
import CreatePoolModal from "../create-pool-modal";
import ManagePoolModal from "../manage-pool-modal";
// Library, Store Imports
import { cn } from "@lib/utils";
import { usePools } from "@lib/hooks/usePools";
import { TableOptions } from "./helper";
import { useFilteredPools } from "@lib/hooks/useFilteredPools";
import MyPoolsTable from "./MyPoolsTable";
import { useModalStore, usePoolsStore } from "@store/poolsStore";
import { useLiquidityHistory } from "@lib/hooks/useLiquidityHistory";
import TransactionsTable from "./TransactionsTable";
import { useFilteredTxs } from "@lib/hooks/useFilteredTxs";
import CreateTokenModal from "../create-token-modal";
import { useMyPools } from "@lib/hooks/useMyPools";
import clsx from "clsx";

const PoolsData = () => {
  const { pools, isFetching } = usePools();
  const { myPools, isFetching: isFetchingMyPools } = useMyPools(pools);
  const { data: liquidityHistory, isFetching: isLiqHistoryFetching } =
    useLiquidityHistory();

  // Pool Creation and Manage Modal state
  const {
    openCreateTokenModal,
    setOpenCreateTokenModal,
    openCreateModal,
    setOpenCreateModal,
    openManageModal,
    setOpenManageModal
  } = useModalStore();

  const [currentTab, setCurrentTab] = useState(TableOptions.all);

  // pools search and filtering
  const [showSearch, setShowSearch] = useState(false);
  const [allTerm, setAllTerm] = useState("");
  const [myTerm, setMyTerm] = useState("");
  const [txTerm, setTxTerm] = useState("");

  const { pools: filteredAllPools } = useFilteredPools(pools, allTerm);
  const { pools: filteredMyPools } = useFilteredPools(myPools, myTerm);
  const { txs: filteredTxs } = useFilteredTxs(liquidityHistory, txTerm);
  const { updateSelectedPool } = usePoolsStore();

  const poolsColumns = allPoolsColumnDef(updateSelectedPool);
  const userColumns = userPoolsColumnDef();
  const txColumns = transactionsColumnDef();

  const activeTabStyle = clsx(
    "py-2 px-4 rounded-lg border border-primary-gray",
    "data-[state=active]:border-tab-blue data-[state=active]:bg-[#0A344D]",
    "transition-colors duration-300 ease-linear"
  );

  return (
    <div className="py-10">
      <Tabs value={currentTab} onValueChange={setCurrentTab as (value: string) => void}>
        <div className="inline-flex items-center justify-between w-full font-medium text-sm/5 py-4 border-t border-b border-secondary-gray mb-6">
          <TabsList className="inline-flex">
            <TabsTrigger value={TableOptions.all} className={cn(activeTabStyle)}>
              All Pools
            </TabsTrigger>
            <TabsTrigger value={TableOptions.my} className={cn(activeTabStyle)}>
              My Pools
            </TabsTrigger>
            <TabsTrigger value={TableOptions.trxn} className={cn(activeTabStyle)}>
              Transactions
            </TabsTrigger>
          </TabsList>
          <div className="inline-flex items-center gap-6">
            <button
              className="inline-flex items-center py-2 px-3 gap-1 text-[#49AFE9] hover:bg-[#0A344D] transition-colors font-medium text-sm/5 rounded-lg font-sans-ibm-plex disabled:cursor-not-allowed disabled:opacity-80"
              onClick={() => setOpenCreateTokenModal(true)}
              disabled={true}
            >
              <PlusIcon size={16} /> Create a Token
            </button>
            <button
              className="inline-flex items-center py-2 px-3 gap-1 text-[#49AFE9] hover:bg-[#0A344D] transition-colors font-medium text-sm/5 rounded-lg font-sans-ibm-plex disabled:cursor-not-allowed disabled:opacity-80"
              onClick={() => setOpenCreateModal(true)}
              disabled={true}
            >
              <PlusIcon size={16} /> Create Pool
            </button>
            <SearchInput
              term={
                currentTab === TableOptions.all
                  ? allTerm
                  : currentTab === TableOptions.my
                    ? myTerm
                    : txTerm
              }
              setTerm={
                currentTab === TableOptions.all
                  ? setAllTerm
                  : currentTab === TableOptions.my
                    ? setMyTerm
                    : setTxTerm
              }
              showSearch={showSearch}
              setShowSearch={setShowSearch}
            />
          </div>
        </div>
        <TabsContent value={TableOptions.all}>
          <PoolsTable
            columns={poolsColumns}
            data={filteredAllPools}
            loading={isFetching}
          />
        </TabsContent>
        <TabsContent value={TableOptions.my}>
          <MyPoolsTable
            columns={userColumns}
            data={filteredMyPools}
            pool={filteredMyPools[filteredMyPools.length - 1]} // passes the first pool as default
            loading={isFetchingMyPools}
          />
        </TabsContent>
        <TabsContent value={TableOptions.trxn}>
          <TransactionsTable
            columns={txColumns}
            data={filteredTxs}
            pool={filteredMyPools[filteredMyPools.length - 1]} // passes the first pool as default
            loading={isLiqHistoryFetching}
          />
        </TabsContent>
      </Tabs>
      {openCreateTokenModal && (
        <CreateTokenModal open={openCreateTokenModal} setOpen={setOpenCreateTokenModal} />
      )}
      {openCreateModal && (
        <CreatePoolModal open={openCreateModal} setOpen={setOpenCreateModal} />
      )}
      {openManageModal && (
        <ManagePoolModal open={openManageModal} setOpen={setOpenManageModal} />
      )}
    </div>
  );
};

export default PoolsData;
