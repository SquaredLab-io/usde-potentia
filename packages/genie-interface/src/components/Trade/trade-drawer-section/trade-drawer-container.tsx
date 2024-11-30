import AppDrawer from "@components/common/AppDrawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { TradeOptions } from "@lib/types/enums";
import { cn } from "@lib/utils";
import { useTradeStore } from "@store/tradeStore";
import LongTradeDrawer from "./long-trade";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import ShortTradeDrawer from "./short-trade";

const TradeDrawerContainer = ({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) => {
  const { tradeType, setTradeType } = useTradeStore();
  const { potentia } = usePotentiaSdk();

  return (
    <AppDrawer open={open} onOpenChange={onOpenChange} className="pb-6">
      <div className="flex flex-col w-full">
        {/* Long and Short Tabs and their content */}
        <Tabs value={tradeType} onValueChange={setTradeType} className="w-full">
          <TabsList className="w-full flex flex-row items-center font-semibold text-base">
            <TabsTrigger
              value={TradeOptions.long}
              className={cn(
                "data-[state=active]:border-[#07AD3B] text-[#07AD3B] rounded-tl-2xl",
                "active-tab-trade-drawer"
              )}
            >
              Long
            </TabsTrigger>
            <TabsTrigger
              value={TradeOptions.short}
              className={cn(
                "data-[state=active]:border-[#FF3318] text-[#FF3318] rounded-tr-2xl",
                "active-tab-trade-drawer"
              )}
            >
              Short
            </TabsTrigger>
          </TabsList>
          <TabsContent value={TradeOptions.long}>
            <LongTradeDrawer potentia={potentia} />
          </TabsContent>
          <TabsContent value={TradeOptions.short}>
            <ShortTradeDrawer potentia={potentia} />
          </TabsContent>
        </Tabs>
      </div>
    </AppDrawer>
  );
};

export default TradeDrawerContainer;
