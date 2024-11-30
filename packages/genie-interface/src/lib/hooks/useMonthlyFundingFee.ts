import { Address, getAddress } from "viem";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { REFETCH_INTERVAL } from "@lib/constants";

export type FundingFeeData =
  | {
      feePerToken: number;
      feePercent: number;
    }
  | undefined;

export type FeeCumulativeSumData =
  | {
      fee: bigint;
      date: bigint;
    }[]
  | undefined;

type ReturnMonthlyFundingFee = {
  fundingFeeData: FundingFeeData;
  cumulativeSumData: FeeCumulativeSumData;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<[FundingFeeData, FeeCumulativeSumData], Error>>;
};

/**
 * useMonthlyFundingFee fetches the 30-day funding fee for the specified Pool
 * @param poolAddress The address of the pool to fetch funding fee for
 * @param paused Optional parameter to pause the query
 * @returns data, isFetching, refetch
 */
export function useMonthlyFundingFee(
  poolAddress: Address | undefined,
  paused = false
): ReturnMonthlyFundingFee {
  const { potentia } = usePotentiaSdk();

  async function getMonthlyFundingFee(): Promise<FundingFeeData> {
    try {
      if (!poolAddress) {
        console.error("No pool address provided");
        return undefined;
      }
      const result = await potentia?.ponderClient.get30DFunding(getAddress(poolAddress));
      return result;
    } catch (error) {
      console.error("Error -- fetching monthly funding fee", error);
      return undefined;
    }
  }

  async function get30DFeeCumulativeSum(): Promise<FeeCumulativeSumData> {
    try {
      if (!poolAddress) {
        console.error("No pool address provided");
        return undefined;
      }
      const result = await potentia?.get30DFeeCumulativeSum(getAddress(poolAddress));
      return result;
    } catch (error) {
      console.error("Error -- fetching 30D fee cumulative sum", error);
      return undefined;
    }
  }

  const { data, isFetching, refetch } = useQuery<[FundingFeeData, FeeCumulativeSumData]>({
    queryKey: ["monthlyFundingFeeData", poolAddress],
    queryFn: async () => {
      const [fundingFee, cumulativeSum] = await Promise.all([
        getMonthlyFundingFee(),
        get30DFeeCumulativeSum()
      ]);
      return [fundingFee, cumulativeSum];
    },
    refetchInterval: REFETCH_INTERVAL,
    enabled: !paused && !!poolAddress && !!potentia
  });

  const [fundingFeeData, cumulativeSumData] = data ?? [undefined, undefined];

  return { fundingFeeData, cumulativeSumData, isFetching, refetch };
}
