"use client";

import { useMemo } from "react";
import { Address } from "viem";
// Trade
import AddLiquidity from "./trade/AddLiquidity";
import RemoveLiquidity from "./trade/RemoveLiquidity";
// Charts
import { LpTradeOptions } from "@lib/types/enums";
import LpTradeSelector from "./lp-trade-selector";
import { Separator } from "@components/ui/separator";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { useModalStore } from "@store/poolsStore";
import PoolHeader from "./pool-header";
import LPChart from "./lp-charts";
import PoolOverviewModal from "./pool-overview-modal";
import { useLpStore } from "@store/lpStore";
import { getPoolTokens } from "@lib/utils/pools";
import { useCurrentLpPosition } from "@lib/hooks/useCurrentLpPosition";

const PoolOverview = ({ overviewPool }: { overviewPool: PoolInfo }) => {
  const { lpTradeOption, setLpTradeOption } = useLpStore();
  const { openSelectPoolOverviewModal, setOpenSelectPoolOverviewModal } = useModalStore();

  const { pool, power } = overviewPool;
  const tokens = useMemo(() => getPoolTokens(pool), [pool]);

  const lpTokenBalance = useCurrentLpPosition({
    poolAddress: overviewPool.poolAddr as Address
  });

  return (
    <div className="overflow-auto pl-11 pt-11 h-full">
      {/* Header */}
      <PoolHeader assets={tokens} power={power} />
      {/* Graph and Add/Remove Liquidity Box */}
      <div className="grid grid-cols-7 mt-8 h-[calc(100vh-254px)] 2xl:h-[calc(100vh-280px)] 3xl:h-[calc(100vh-300px)]">
        <div className="col-span-5 border border-gray-800">
          <LPChart overviewPool={overviewPool} />
        </div>
        <div className="col-span-2 min-w-[402px] w-full">
          <div className="flex flex-col h-full border-y border-secondary-gray">
            <header className="inline-flex items-center justify-between p-5">
              <h2 className="font-medium text-lg/6">
                {lpTradeOption === LpTradeOptions.supply
                  ? "Add Liquidity"
                  : "Remove Liquidity"}
              </h2>
              <LpTradeSelector lpTrade={lpTradeOption} setLpTrade={setLpTradeOption} />
            </header>
            <Separator className="mb-3" />
            <div className="flex-grow overflow-y-auto h-fit max-h-[640px] px-5">
              {lpTradeOption === LpTradeOptions.supply ? (
                <AddLiquidity
                  overviewPool={overviewPool}
                  lpTokenBalance={lpTokenBalance}
                />
              ) : (
                <RemoveLiquidity
                  overviewPool={overviewPool}
                  lpTokenBalance={lpTokenBalance}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <PoolOverviewModal
        open={openSelectPoolOverviewModal}
        setOpen={setOpenSelectPoolOverviewModal}
      />
    </div>
  );
};

export default PoolOverview;
