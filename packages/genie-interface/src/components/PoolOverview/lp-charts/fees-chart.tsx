import { memo, useEffect, useRef, useState, useMemo } from "react";
import { createChart, IChartApi, ISeriesApi } from "lightweight-charts";
import { FeeCumulativeSumData } from "@lib/hooks/useMonthlyFundingFee";
import { getFeesTimeseries } from "../helper";
import LoadingLogo from "@components/icons/loading-logo";
import { chartOptionsConfig, colors } from "./configs";

const FeeChart = ({
  cumulativeSumData,
  isFetching
}: {
  cumulativeSumData: FeeCumulativeSumData;
  isFetching: boolean;
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const [isLoadingChart, setIsLoadingChart] = useState(false);

  // Reversed as we need series in ascending order
  const timeseries = useMemo(
    () => getFeesTimeseries(cumulativeSumData),
    [cumulativeSumData]
  );

  useEffect(() => {
    if (chartContainerRef.current && (!chartRef.current || timeseries.length > 0)) {
      setIsLoadingChart(true);

      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight
          });
        }
      };

      if (!chartRef.current) {
        const chartOptions = chartOptionsConfig(chartContainerRef);
        chartRef.current = createChart(chartContainerRef.current, chartOptions);

        window.addEventListener("resize", handleResize);
      }

      if (chartRef.current && timeseries.length > 0) {
        seriesRef.current = chartRef.current.addLineSeries({
          color: colors.feesSeriesColor,
          lastValueVisible: false,
          priceLineVisible: false
        });
        seriesRef.current.setData(timeseries);
        chartRef.current.timeScale().fitContent();
        // seriesRef.current.priceScale().applyOptions({
        //   autoScale: false
        // });
      }

      setIsLoadingChart(false);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
          seriesRef.current = null;
        }
      };
    }
  }, [timeseries]); // Now we depends on timeseries only

  return (
    <div className="relative h-[calc(100%-20px)]">
      {(isLoadingChart || isFetching) && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-gray bg-opacity-50 z-10">
          <LoadingLogo size={80} />
        </div>
      )}
      <div className="size-full" ref={chartContainerRef} />
    </div>
  );
};

export default memo(FeeChart);
