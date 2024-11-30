import { memo } from "react";
import BigNumber from "bignumber.js";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { Separator } from "@components/ui/separator";
import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
import { formatNumber } from "@lib/utils/formatting";
import { cn } from "@lib/utils";
import { useTokenPrice } from "@lib/hooks/useTokenPrice";

interface MarkerProps {
  label: string;
  value: string;
  fetching: boolean;
  subValue?: string;
  showChange?: boolean;
}

interface PricesBarProps {
  selectedPool: PoolInfo | undefined;
}

function Marker({ label, value, fetching, subValue, showChange = false }: MarkerProps) {
  const _subValue = subValue ? parseFloat(subValue) : undefined;
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="text-nowrap underline underline-offset-[1.5px] text-[#757B80]">
        {label}
      </span>
      <div className="inline-flex items-center gap-x-1">
        <span
          className={cn(
            showChange &&
              (parseFloat(value) > 0 ? "text-positive-green" : "text-negative-red")
          )}
        >
          {fetching && !value ? "-" : value}
        </span>
        {_subValue ? (
          <span
            className={cn(_subValue > 0 ? "text-positive-green" : "text-negative-red")}
          >
            ({_subValue > 0 && "+"}
            {_subValue === 0 ? "-" : _subValue}%)
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

const PricesBar = ({ selectedPool }: PricesBarProps) => {
  const underlying = selectedPool?.underlying;
  const { price, marketData, isMarketDataLoading } = useCurrencyPrice(underlying);

  const { tokenPrices, isFetching, status } = useTokenPrice({
    poolAddress: selectedPool?.poolAddr
  });

  const fundingRateLong = parseFloat(
    new BigNumber(tokenPrices?.fundingInfo.longF ?? 0).toString() ?? "0"
  );
  const fundingRateShort = parseFloat(
    new BigNumber(tokenPrices?.fundingInfo.shortF ?? 0).toString() ?? "0"
  );

  return (
    <div className="flex flex-row items-center justify-start gap-6 2xl:gap-5 3xl:gap-8 h-full w-full px-3 lg:px-2 xl:px-6 font-normal text-xs/4 overflow-x-auto z-50 border-t lg:border-none border-secondary-gray">
      <div className="inline-flex items-center py-3 gap-6 2xl:gap-5 3xl:gap-8">
        <p className="flex flex-col items-start justify-center gap-2 lg:gap-1 -mb-2 h-full">
          <span className="font-bold text-lg/[8px] text-white">
            {isMarketDataLoading && price === 0 ? "loading..." : (price ?? "-")}
          </span>
          <span
            className={
              !!marketData?.price_change_percentage_24h &&
              marketData?.price_change_percentage_24h > 0
                ? "text-positive-green"
                : "text-negative-red"
            }
          >
            {isMarketDataLoading || !marketData
              ? "..."
              : `${marketData.price_change_percentage_24h.toPrecision(3)}%`}
          </span>
        </p>
        <Marker
          label="24h High"
          value={marketData ? (marketData.high_24h ?? 0).toString() : "-"}
          fetching={isMarketDataLoading}
        />
        <Marker
          label="24h Low"
          value={marketData ? (marketData.low_24h ?? 0).toString() : "-"}
          fetching={isMarketDataLoading}
        />
      </div>
      <Separator orientation="vertical" />
      <div className="inline-flex gap-6 py-3 2xl:gap-5 3xl:gap-8">
        <Marker
          label="Long Price"
          value={formatNumber(parseFloat(tokenPrices?.lastLongP!))}
          subValue={formatNumber(parseFloat(tokenPrices?.longDailyChange!))}
          fetching={isFetching}
        />
        <Marker
          label="Short Price"
          value={formatNumber(parseFloat(tokenPrices?.lastShortP!))}
          subValue={formatNumber(parseFloat(tokenPrices?.shortDailyChange!))}
          fetching={isFetching}
        />
        <Marker
          label="Long Funding Rate"
          value={`${fundingRateLong > 0 ? "+" : ""}${fundingRateLong ? `${fundingRateLong.toFixed(8)}%` : "-"}`}
          fetching={isFetching}
          showChange
        />
        <Marker
          label="Short Funding Rate"
          value={`${fundingRateShort > 0 ? "+" : ""}${fundingRateShort ? `${fundingRateShort.toFixed(8)}%` : "-"}`}
          fetching={isFetching}
          showChange
        />
        <Marker
          label="24h Volume"
          value={formatNumber(
            parseFloat(tokenPrices?.volume!) / 10 ** selectedPool?.underlyingDecimals!
          )}
          fetching={isFetching}
        />
      </div>
    </div>
  );
};

export default memo(PricesBar);
