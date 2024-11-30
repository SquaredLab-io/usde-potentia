import { memo, useEffect, useRef, useState } from "react";
import { createChart, IChartApi } from "lightweight-charts";
import { DailyInfo } from "@squaredlab-io/sdk/";
import { getTvlTimeseries } from "../helper";
import { chartOptionsConfig, colors } from "./configs";
import LoadingLogo from "@components/icons/loading-logo";

const TVLChart = ({
  dailyData,
  loading
}: {
  dailyData: DailyInfo[] | undefined;
  loading: boolean;
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  // Reversed as we need series in ascending order
  const timeseries = getTvlTimeseries(dailyData);

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
        const series = chartRef.current.addAreaSeries({
          lineColor: colors.lineColorTwo,
          topColor: colors.areaColor,
          bottomColor: colors.areaColor
        });
        series.setData(timeseries);
        chartRef.current.timeScale().fitContent();
      }

      setIsLoadingChart(false);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    }
  }, [timeseries]); // Now we depend on timeseries

  return (
    <div className="relative h-[calc(100%-20px)]">
      {isLoadingChart || loading ? (
        <div className="size-full flex-col-center">
          <LoadingLogo size={80} />
        </div>
      ) : (
        <div className="size-full" ref={chartContainerRef} />
      )}
    </div>
  );
};

export default memo(TVLChart);
