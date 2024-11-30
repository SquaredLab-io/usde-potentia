// Library Imports
import { useRef, useState } from "react";
import Script from "next/script";
// Component, Util Imports
import ChartLoader from "./TradeChart/loader";
import TradeChart from "./TradeChart";
import TradeData from "./TradeData";
import MarketData from "./MarketData";
import TradeSection from "./TradeSection";
import AssetStatsBar from "./AssetStatsBar";
import TokenSelectorModal from "@components/common/token-selector-modal";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { useModalStore } from "@store/poolsStore";

const Trade = () => {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const tradeDataContainerRef = useRef<HTMLDivElement>(null);

  const { potentia } = usePotentiaSdk();
  const { openTokenSelectorModal, setOpenTokenSelectorModal } = useModalStore();

  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          // console.log("Chart script is ready!");
          setIsScriptReady(true);
        }}
      />
      <div className="flex flex-col h-full flex-auto flex-grow">
        {/* top box */}
        <div className="flex-auto flex flex-row min-w-full">
          {/* left section -- (flexible) */}
          <div className="flex flex-col flex-auto max-w-full lg:max-w-[calc(100vw-346px)] border-r border-t border-secondary-gray">
            <AssetStatsBar />
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr] w-full h-full min-h-96">
              {isScriptReady && potentia ? (
                <TradeChart potentia={potentia} />
              ) : (
                <ChartLoader />
              )}
            </div>
            {/* <TradeFlow /> */}
          </div>

          {/* right section -- (fixed width) */}
          <div className="hidden lg:flex flex-auto flex-grow min-w-[346px] w-[346px] max-w-[346px]">
            <TradeSection />
          </div>
        </div>

        {/* bottom box */}
        <div className="flex flex-auto flex-row border-t border-secondary-gray">
          {/* left section -- (flexible) */}
          <div
            ref={tradeDataContainerRef}
            className="flex flex-auto border-r border-secondary-gray"
          >
            <TradeData containerRef={tradeDataContainerRef} />
          </div>
          {/* right section -- (fixed width) */}
          <div className="hidden lg:flex flex-initial min-w-[346px] w-[346px] max-w-[346px]">
            <MarketData />
          </div>
        </div>
      </div>
      <TokenSelectorModal
        open={openTokenSelectorModal}
        setOpen={setOpenTokenSelectorModal}
      />
    </>
  );
};

export default Trade;
