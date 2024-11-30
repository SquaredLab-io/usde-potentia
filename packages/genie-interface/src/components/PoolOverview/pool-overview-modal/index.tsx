// Library Imports
import { FC, memo, ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
// Component Imports
import SearchInput from "./SearchInput";
import Modal from "@components/common/Modal";
import PoolOverviewTable from "./PoolOverviewTable";
import { Separator } from "@components/ui/separator";
// Hook, Helper and Type Imports
import { usePools } from "@lib/hooks/usePools";
import { REFETCH_INTERVAL } from "@lib/constants";
import { poolOverviewColumnDef } from "./pool-overview-columns";
import { FetchPoolsDataResponse, useFilteredPoolOverview } from "@lib/hooks/useFilteredPoolOverview";
import getPoolsMarketData from "@lib/utils/getPoolsData";

interface PropsType {
  children?: ReactNode | undefined;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const PoolOverviewModal: FC<PropsType> = ({ children, open, setOpen }) => {
  const [term, setTerm] = useState("");

  // hooks
  const { pools, isFetching } = usePools();

  const poolOverviewColumns = poolOverviewColumnDef();

  // react-query
  const { data: poolOverviewData, isLoading: isPoolOverviewDataLoading } = useQuery<
    FetchPoolsDataResponse[],
    Error
  >({
    queryKey: ["poolOverviewData"], // Do we need any more keys here?
    queryFn: () => getPoolsMarketData(pools),
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!pools,
    staleTime: 30000
  });

  // Filtering based on Search term
  const { filteredPoolsOverview } = useFilteredPoolOverview(
    pools,
    poolOverviewData,
    term
  );

  const isLoading = isFetching || isPoolOverviewDataLoading;

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      closable={true}
      className="bg-primary-gray min-w-[40rem] rounded-lg pt-2 pb-4"
    >
      <div className="pb-4 pl-5 mr-20">
        <SearchInput term={term} setTerm={setTerm} placeholder="Search markets" />
      </div>
      <Separator />
      <h1 className="inline-flex font-medium text-sm/5 pt-6 pl-4 pb-3 w-full">Pools</h1>
      <PoolOverviewTable
        columns={poolOverviewColumns}
        data={filteredPoolsOverview}
        loading={isLoading}
        setOpen={setOpen}
      />
    </Modal>
  );
};

export default memo(PoolOverviewModal);
