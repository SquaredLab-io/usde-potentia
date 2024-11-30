import { useState } from "react";
import { useAccount } from "wagmi";
import TradeButton from "./trade-buttons";
import TradeDrawerContainer from "./trade-drawer-container";
import { useTradeStore } from "@store/tradeStore";
import { TradeOptions } from "@lib/types/enums";

const TradeDrawerSection = () => {
  // Drawer state
  const [isTradeDrawer, setIsTradeDrawer] = useState(false);
  const { setTradeType } = useTradeStore();

  const { isConnected } = useAccount();

  if (!isConnected) return <></>;

  return (
    <div className="flex lg:hidden flex-row items-center gap-2 mb-4 w-full max-h-fit absolute bottom-4 px-3">
      <TradeButton
        variant={"long"}
        className="w-1/2 float-left"
        onClick={() => {
          setTradeType(TradeOptions.long);
          setIsTradeDrawer(true);
        }}
      >
        Long
      </TradeButton>
      <TradeButton
        variant={"short"}
        className="w-1/2 float-right"
        onClick={() => {
          setTradeType(TradeOptions.short);
          setIsTradeDrawer(true);
        }}
      >
        Short
      </TradeButton>
      {isTradeDrawer && (
        <TradeDrawerContainer open={isTradeDrawer} onOpenChange={setIsTradeDrawer} />
      )}
    </div>
  );
};

export default TradeDrawerSection;
