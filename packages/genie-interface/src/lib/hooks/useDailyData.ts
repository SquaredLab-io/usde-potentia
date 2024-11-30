import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { DailyInfo, DailyInfoArray } from "@squaredlab-io/sdk";
import getUrqlClient from "@lib/utils/urql/get-urql-client";
import notification from "@components/common/notification";

interface PropsType {
  poolAddress: string;
  paused?: boolean;
  limit?: number;
}

interface ReturnType {
  dailyData: DailyInfo[] | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<DailyInfo[] | undefined, Error>>;
}

// URQL Client
const [client] = getUrqlClient();

const getDailyData = async (pool: string, limit?: number): Promise<DailyInfoArray> => {
  const filterQuery = `{pool: "${pool}"}`;
  const limitClause = limit !== undefined ? `limit: ${limit},` : "";
  const QUERY = `
   query MyQuery {
      dailyInfos(
        where: ${filterQuery}
        orderBy: "date"
        orderDirection: "desc"
        ${limitClause}
      ) {
        items {
          fee
          lastLongPrice
          date
          lastShortPrice
          lastTvl
          maxTvl
          minTvl
          pool
          volume
          id
        }
      }
    }    
  `;

  let res = await client.query<DailyInfoArray>(QUERY, {});
  if (res.data == null) {
    throw new Error("No data found");
  }
  return res.data;
};

/**
 *
 * @param poolAddress
 * @param paused Pause the auto fetching
 * @returns dailyInfos, isFetching, refetch
 */
export function useDailyData({
  poolAddress,
  paused = false,
  limit
}: PropsType): ReturnType {
  const fetch = async () => {
    try {
      const info = await getDailyData(poolAddress, limit);
      return info.dailyInfos.items;
    } catch (error) {
      notification.error({
        id: "daily-data",
        title: "Failed to fetch daily data",
        description: `${error}`
      });
    }
  };

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["poolDailyInfo", poolAddress],
    queryFn: fetch,
    enabled: !!client && !!poolAddress && !paused,
    staleTime: 0,
    gcTime: 0
  });

  return {
    dailyData: data,
    isFetching,
    refetch
  } satisfies ReturnType;
}
