import { PoolOverviewData } from "@lib/utils/getPoolsData";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";

export interface FetchPoolsDataResponse extends PoolOverviewData {
  underlying_symbol: string;
}

export interface ConstructedPoolsDataResponse extends FetchPoolsDataResponse {
  pool: string;
  power: number;
  poolAddr: string;
}

interface ReturnType {
  filteredPoolsOverview: ConstructedPoolsDataResponse[];
  noPools: boolean;
}

const getConstructedPoolOverviewData = (
  pools: PoolInfo[],
  poolsOverviewData: FetchPoolsDataResponse[]
): ConstructedPoolsDataResponse[] => {
  return pools.map((_pool) => {
    const overviewData = poolsOverviewData.find(
      (poolOverviewData) => _pool.underlying === poolOverviewData.underlying_symbol
    ) as FetchPoolsDataResponse;
    return {
      ...overviewData,
      pool: _pool.pool,
      power: _pool.power,
      poolAddr: _pool.poolAddr
    } satisfies ConstructedPoolsDataResponse;
  });
};

export function useFilteredPoolOverview(
  pools: PoolInfo[] | undefined,
  poolsOverviewData: FetchPoolsDataResponse[] | undefined,
  term: string
): ReturnType {
  if (!pools || !poolsOverviewData) return { filteredPoolsOverview: [], noPools: true };
  else if (term === "") {
    const constructedPoolOverviewData = getConstructedPoolOverviewData(
      pools,
      poolsOverviewData
    );
    return { filteredPoolsOverview: constructedPoolOverviewData, noPools: false };
  }

  const constructedPoolOverviewData = getConstructedPoolOverviewData(
    pools,
    poolsOverviewData
  );

  const searchTerm = term.toLowerCase();
  const filtered = constructedPoolOverviewData.filter((pool) => {
    const matchTerm = `${pool.underlying_symbol}`.toLowerCase();
    if (matchTerm.indexOf(searchTerm) >= 0) return true;
    return false;
  });
  const noPools = filtered.length === 0;
  return { filteredPoolsOverview: filtered, noPools };
}
