import { Address } from "viem";
import { PoolInfo } from "@squaredlab-io/sdk";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { useDailyData } from "@lib/hooks/useDailyData";
import { CLChartData, GraphOptions } from "../helper";
import TVLChart from "./tvl-chart";
import VolumeChart from "./volume-chart";
import CLChart from "./cl-chart-echart";
import FeesChart from "./fees-chart";
import { useLpStore } from "@store/lpStore";
import { useQuery } from "@tanstack/react-query";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { useMonthlyFundingFee } from "@lib/hooks/useMonthlyFundingFee";

const LPChart = ({ overviewPool }: { overviewPool: PoolInfo }) => {
  const { potentia } = usePotentiaSdk();

  // TVL and Vol Chart data
  const { dailyData, isFetching: isFetchingDailyData } = useDailyData({
    poolAddress: overviewPool?.poolAddr as Address
  });

  // Fees Chart data
  const { cumulativeSumData, isFetching: isFeesFetching } = useMonthlyFundingFee(
    overviewPool.poolAddr as Address
  );

  // Counterpart Liquidity Chart data
  const { data: clChartData, isFetching: isCLFetching } = useQuery({
    queryKey: ["clChart", overviewPool.poolAddr],
    queryFn: async () => {
      try {
        return (await potentia?.getCLChartData(
          overviewPool.poolAddr as Address,
          5,
          1000
        )) satisfies CLChartData | undefined;
      } catch (error) {
        console.error("error while fetching clchart data", error);
      }
    },
    enabled: !!potentia && !!overviewPool,
    staleTime: 0,
    gcTime: 0,
    retry: 4
  });

  const { lpGraphOption, setLpGraphOption } = useLpStore();

  return (
    <Tabs
      defaultValue={lpGraphOption}
      onValueChange={(value) => setLpGraphOption(value as GraphOptions)}
      className="size-full"
    >
      <TabsList className="inline-flex justify-start font-medium text-sm/6 w-full">
        <TabsTrigger value={GraphOptions.volume} className="graph-tab">
          Volume
        </TabsTrigger>
        <TabsTrigger value={GraphOptions.tvl} className="graph-tab">
          TVL
        </TabsTrigger>
        <TabsTrigger value={GraphOptions.fees} className="graph-tab">
          Fees Yield
        </TabsTrigger>
        <TabsTrigger value={GraphOptions.counterpart} className="graph-tab">
          Counterpart Liquidity
        </TabsTrigger>
      </TabsList>
      <TabsContent value={GraphOptions.volume} className="h-[calc(100%-36px)]">
        <VolumeChart dailyData={dailyData} loading={isFetchingDailyData} />
      </TabsContent>
      <TabsContent value={GraphOptions.tvl} className="h-[calc(100%-36px)]">
        <TVLChart dailyData={dailyData} loading={isFetchingDailyData} />
      </TabsContent>
      <TabsContent value={GraphOptions.fees} className="h-[calc(100%-36px)]">
        <FeesChart cumulativeSumData={cumulativeSumData} isFetching={isFeesFetching} />
      </TabsContent>
      <TabsContent value={GraphOptions.counterpart} className="h-[calc(100%-40px)]">
        <CLChart chartData={clChartData} isFetching={isCLFetching} />
      </TabsContent>
    </Tabs>
  );
};

export default LPChart;
