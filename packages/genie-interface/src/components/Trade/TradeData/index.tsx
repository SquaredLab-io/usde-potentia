/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { memo, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { _getDecimalAdjusted } from "@lib/utils/formatting";
import { getClosedTransactions, getOpenTransactions } from "./helper";
import { useTxHistory } from "@lib/hooks/useTxHistory";
import { useOpenOrders } from "@lib/hooks/useOpenOrders";
import { useAccount } from "wagmi";
import OpenPositionSection from "./open-position-section";
import TradeHistorySection from "./trade-history-section";
import TradeButton from "@components/Trade/trade-drawer-section/trade-buttons";
import TradeDrawerSection from "../trade-drawer-section";

enum Tab {
  position = "position",
  history = "history"
}

const TradeData = ({ containerRef }: { containerRef: RefObject<HTMLDivElement> }) => {
  const [tableHeight, setTableHeight] = useState<number>(235);
  const tabListRef = useRef<HTMLDivElement>(null);

  const { isConnected } = useAccount();

  // All Transactions -- LP, Open Long/Short, Close Long/Short
  const { data: tradeHistory, isFetching: isTradeLoading } = useTxHistory();
  const { openOrders, isFetching: loadingOpenOrders } = useOpenOrders();

  const openPositions = useMemo(() => getOpenTransactions(openOrders), [openOrders]);

  const closedPositions = useMemo(
    () => getClosedTransactions(tradeHistory),
    [tradeHistory]
  );

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current && tabListRef.current) {
        const newHeight =
          containerRef.current.offsetHeight - tabListRef.current.offsetHeight;
        setTableHeight(newHeight);
      }
    };
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  const tabStyle =
    "data-[state=active]:bg-white data-[state=active]:text-black uppercase py-2 px-4";

  return (
    <div className="relative w-full font-medium text-xs leading-4 lg:h-[276px]">
      {/* Tab Row */}
      <Tabs defaultValue={Tab.position}>
        <TabsList
          ref={tabListRef}
          className="flex flex-row justify-start rounded-none font-medium text-sm/6 font-sans-ibm-plex border-b border-secondary-gray"
        >
          <TabsTrigger value={Tab.position} className={tabStyle}>
            Open Positions{loadingOpenOrders ? "..." : ""} (
            {isConnected ? openPositions.length : "0"})
          </TabsTrigger>
          <TabsTrigger value={Tab.history} className={tabStyle}>
            History
          </TabsTrigger>
        </TabsList>
        {/* Tab Content */}
        {/* --- Open Positions Table --- */}
        <TabsContent
          value={Tab.position}
          style={{ maxHeight: `${tableHeight}px` }}
          className="h-full max-h-[calc(100vh-454px)] lg:min-h-[235px]  overflow-y-auto trade-history"
        >
          <OpenPositionSection
            openPositions={openPositions}
            loadingOpenOrders={loadingOpenOrders}
          />
        </TabsContent>
        {/* --- Transactions History Table --- */}
        <TabsContent
          value={Tab.history}
          style={{ maxHeight: `${tableHeight}px` }}
          className="h-full max-h-[calc(100vh-454px)] lg:min-h-[235px]  overflow-y-auto trade-history"
        >
          <TradeHistorySection
            closedPositions={closedPositions}
            isTradeLoading={isTradeLoading}
          />
        </TabsContent>
      </Tabs>
      <TradeDrawerSection />
    </div>
  );
};

export default memo(TradeData);
