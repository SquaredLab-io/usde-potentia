import { memo } from "react";
import { useTokenPrice } from "@lib/hooks/useTokenPrice";
import { cn } from "@lib/utils";
import { formatNumber } from "@lib/utils/formatting";
import { usePoolsStore } from "@store/poolsStore";

interface MarkerProps {
  label: string;
  value: string;
  fetching?: boolean;
  showChange?: boolean;
  className?: string;
}

export function Marker({
  label,
  value,
  fetching = false,
  showChange = false,
  className
}: MarkerProps) {
  return (
    <p className={cn("inline-flex items-center justify-between w-full", className)}>
      <span className="text-[#6D6D6D]">{label}</span>
      <span
        className={cn(
          "font-medium",
          showChange
            ? parseFloat(value ?? "0") > 0
              ? "text-positive-green"
              : "text-negative-red"
            : "text-white"
        )}
      >
        {fetching && !value ? "-" : value}
      </span>
    </p>
  );
}

const TradeInfo = () => {
  const { selectedPool } = usePoolsStore();

  const { tokenPrices, isFetching: isFetchingPrice } = useTokenPrice({
    poolAddress: selectedPool()?.poolAddr
  });

  return (
    <div className="flex flex-col gap-2 mt-3 lg:mt-5 font-normal text-xs/[14px]">
      <Marker label={"Fee"} value={"-"} />
      <Marker
        label={"TVL"}
        value={`${formatNumber(parseFloat(tokenPrices?.tvl ?? "0") / 10 ** 18)}`}
        fetching={isFetchingPrice}
      />
      <Marker
        label={"Volume (24h)"}
        value={formatNumber(
          parseFloat(tokenPrices?.volume!) /
            10 ** (selectedPool()?.underlyingDecimals ?? 18)
        )}
        fetching={isFetchingPrice}
      />
    </div>
  );
};

export default memo(TradeInfo);
