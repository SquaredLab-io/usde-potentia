import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
import { cn } from "@lib/utils";
import { formatNumber } from "@lib/utils/formatting";
import { usePoolsStore } from "@store/poolsStore";
import { BiSolidDownArrow } from "react-icons/bi";
import { BiSolidUpArrow } from "react-icons/bi";

interface MarkerProps {
  label: string;
  value: string;
  fetching: boolean;
  showIndicator?: boolean;
}

const ReturnCorrectIndicator = ({ value }: { value: string }) => {
  switch (true) {
    case parseFloat(value) > 0:
      return <BiSolidUpArrow color="#44BD22" />;
    case parseFloat(value) < 0:
      return <BiSolidDownArrow color="#CF1800" />;
    default:
      return null;
  }
};

function Marker({ label, value, fetching, showIndicator = false }: MarkerProps) {
  return (
    <div className="inline-flex items-center justify-between w-full">
      <span className="text-[#757B80]">{label}</span>
      <span className={cn("font-medium text-white")}>
        {fetching ? (
          "-"
        ) : showIndicator ? (
          <span className="inline-flex items-center gap-1">
            <ReturnCorrectIndicator value={value} />
            <span>{value}</span>
          </span>
        ) : (
          value
        )}
      </span>
    </div>
  );
}

const MarketData = () => {
  const { selectedPool } = usePoolsStore();
  const underlying = selectedPool()?.underlying;

  const { marketData, isMarketDataLoading } = useCurrencyPrice(underlying);

  return (
    <div className="px-3 lg:px-4 pb-4 w-full 2xl:px-[16px]">
      <h3 className="font-medium text-sm/[54px]">Underlying Market Data</h3>
      <div className="flex flex-col gap-2 font-normal text-xs/[14px]">
        <Marker
          label={"Market Cap"}
          value={marketData ? `${formatNumber(marketData.market_cap, true) ?? 0}` : "-"}
          fetching={isMarketDataLoading}
        />
        <Marker
          label={"Volume (24h)"}
          value={marketData ? `${formatNumber(marketData.total_volume, true)}` : "-"}
          fetching={isMarketDataLoading}
        />
        <Marker
          label={"Day Change"}
          value={
            marketData ? `${marketData.price_change_percentage_24h.toFixed(3)}%` : "-"
          }
          fetching={isMarketDataLoading}
          showIndicator={true}
        />
      </div>
    </div>
  );
};

export default MarketData;
