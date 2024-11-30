"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { cn } from "@lib/utils";
import LongTrade from "./LongTrade";
import ShortTrade from "./ShortTrade";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { TradeOptions } from "@lib/types/enums";
import { useTradeStore } from "@store/tradeStore";

const Trade = () => {
  const { potentia } = usePotentiaSdk();
  const { tradeType, setTradeType } = useTradeStore();

  return (
    <div className="flex flex-col w-full">
      {/* Long and Short Tabs and their content */}
      <Tabs value={tradeType} onValueChange={setTradeType} className="w-full">
        <TabsList className="w-full flex flex-row items-center font-semibold text-base">
          <TabsTrigger
            value={TradeOptions.long}
            className={cn(
              "data-[state=active]:border-[#07AD3B] text-[#07AD3B]",
              "active-tab-trade"
            )}
          >
            Long
          </TabsTrigger>
          <TabsTrigger
            value={TradeOptions.short}
            className={cn(
              "data-[state=active]:border-[#FF3318] text-[#FF3318]",
              "active-tab-trade"
            )}
          >
            Short
          </TabsTrigger>
        </TabsList>
        <TabsContent value={TradeOptions.long}>
          <LongTrade potentia={potentia} />
        </TabsContent>
        <TabsContent value={TradeOptions.short}>
          <ShortTrade potentia={potentia} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trade;
