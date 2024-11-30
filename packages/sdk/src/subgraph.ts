import { Client, cacheExchange, fetchExchange } from "@urql/core";

export interface PoolQueryResult {
  poolCreateds: PoolCreated[];
}

export interface PoolCreated {
  poolAddr: string;
  poolOp: string;
  blockTimestamp: string;
}

export interface Timeseries {
  // TODO: Define the type of timeseriesDatas
  timeseriesDatas: any[];
}

export interface UserOpenPositions {
  openLongs: Array<{
    R: string;
    alpha: string;
    amount: string;
    beta: string;
    blockNumber: string;
    blockTimestamp: string;
    from: string;
    id: string;
    longAmount: string;
    pool: string;
    transactionHash: string;
    x: string;
  }>;
  openShorts: Array<{
    R: string;
    alpha: string;
    amount: string;
    beta: string;
    blockNumber: string;
    blockTimestamp: string;
    from: string;
    id: string;
    pool: string;
    shortAmount: string;
    transactionHash: string;
    x: string;
  }>;
}

export interface UserTx {
  addLiquidities: any[];
  openLongs: any[];
  openShorts: any[];
  removeLiquidities: any[];
  closeLongs: any[];
  closeShorts: any[];
}

export interface MonthlyInfo {
  id: string;
  date: string;
  volume: string;
  fee: string;
  pool: string;
}

export interface DailyInfo {
  id: string;
  fee: string;
  lastLongPrice: string;
  date: string;
  lastShortPrice: string;
  lastTvl: string;
  maxTvl: string;
  minTvl: string;
  pool: string;
  volume: string;
}

export interface MonthylyQueryResult {
  monthlyInfos: MonthlyInfo[];
}

export interface DailyQueryResult {
  dailyInfos: DailyInfo[];
}
export interface LongShortPriceQueryResult {
  longShortPrices: LongShortPrice[];
}

export interface LongShortPrice {
  id: string;
  longPrice: string;
  pool: string;
  shortPrice: string;
  timestamp: string;
}

export default class Subgraph {
  private urqlClient: Client;

  constructor(graphEndpoint: string) {
    this.urqlClient = new Client({
      url: graphEndpoint,
      exchanges: [cacheExchange, fetchExchange]
    });
  }

  public async getPools(): Promise<PoolCreated[]> {
    const QUERY = `
        query MyQuery {
          poolCreateds {
            poolAddr
            poolOp
            blockTimestamp
          }
        }`;

    const result = await this.urqlClient.query<PoolQueryResult>(QUERY, {});
    if (result.data == null) {
      return [];
    }
    return result.data.poolCreateds;
  }

  public async getLongShortPriceData(
    pool: string,
    from: number,
    to: number,
    resolution?: string
  ): Promise<LongShortPrice[]> {
    const QUERY = `
    query MyQuery {
      longShortPrices(orderBy: timestamp, where: {timestamp_gte: "${from}", timestamp_lte: "${to}", pool: "${pool}"}) {
        id
        longPrice
        pool
        shortPrice
        timestamp
      }
    }`;
    const result = await this.urqlClient.query<LongShortPriceQueryResult>(
      QUERY,
      {}
    );

    if (result.data == null) {
      throw new Error("No data found");
    }

    return result.data!.longShortPrices;
  }

  public async getMonthData(pool: string): Promise<MonthlyInfo[]> {
    const QUERY = `
    query MyQuery {
      monthlyInfos(orderBy: date, orderDirection: desc, where: {pool: "${pool}"}) {
        id
        fee
        pool
        volume,
        date
      }
    }`;
    const result = await this.urqlClient.query<MonthylyQueryResult>(QUERY, {});

    if (result.data == null) {
      throw new Error("No data found");
    }

    return result.data!.monthlyInfos;
  }

  public async getDailyData(
    pool: string,
    addMissingValues?: boolean
  ): Promise<DailyInfo[]> {
    const QUERY = `
    query MyQuery {
      dailyInfos(orderBy: date, orderDirection: desc, where: {pool: "${pool}"}) {
        fee
        lastLongPrice
        date
        lastShortPrice
        lastTvl
        maxTvl
        minTvl
        pool
        volume
      }
    }`;
    const result = await this.urqlClient.query<DailyQueryResult>(QUERY, {});

    if (result.data == null) {
      throw new Error("No data found");
    }

    if (addMissingValues === true) {
    }

    return result.data.dailyInfos;
  }

  public async getDailyInfo(pool: string): Promise<DailyInfo[]> {
    const QUERY = `
    query MyQuery {
      dailyInfos(orderBy: date, orderDirection: desc, where: {pool: "${pool}"}, first: 2) {
        lastLongPrice
        lastShortPrice
        pool
        fee
        lastTvl
        volume
      }
    }`;
    const result = await this.urqlClient.query<DailyQueryResult>(QUERY, {});

    if (result.data == null) {
      throw new Error("No data found");
    }

    if (result.data!.dailyInfos.length > 0) {
      return result.data!.dailyInfos;
    }
    return [];
  }

  public async getLastMonthData(
    pool: string
  ): Promise<MonthlyInfo | undefined> {
    const monthDate = await this.getMonthData(pool);
    if (monthDate.length > 0) {
      return monthDate[0];
    }
    return undefined;
  }

  public async getTimeseries(pool: `0x${string}`) {
    const filterQuery = `{pool: "${pool}"}`;
    const QUERY = `
    query MyQuery {
      timeseriesDatas(orderBy: timestamp, orderDirection:asc, where: ${filterQuery}) {
        CL
        R
        pool
        timestamp
      }
    }
    `;

    const result = await this.urqlClient.query<Timeseries>(QUERY, {});
    if (result == null) {
      return [];
    }

    const timeseriesData = result.data?.timeseriesDatas.map((data) => {
      return {
        CL: data.CL,
        R: data.R,
        pool: data.pool,
        timestamp: data.timestamp
      };
    });

    return timeseriesData;
  }

  public async getUserTxns(
    user: `0x${string}`,
    pool: `0x${string}`
  ): Promise<UserTx> {
    const filterQuery = `{from: "${user}", pool: "${pool}"}`;
    const QUERY = `
    query MyQuery {
      addLiquidities(where: ${filterQuery}) {
        amount
        blockNumber
        blockTimestamp
        from
        id
        lpAmount
        pool
        transactionHash
        x
      }
      openLongs(where: ${filterQuery}) {
        R
        alpha
        amount
        beta
        blockNumber
        blockTimestamp
        from
        id
        longAmount
        pool
        transactionHash
        x
      }
      openShorts(where: ${filterQuery}) {
        R
        alpha
        amount
        beta
        blockNumber
        blockTimestamp
        from
        id
        pool
        shortAmount
        transactionHash
        x
      }
      removeLiquidities(where: ${filterQuery}) {
        x
        transactionHash
        shares
        redeemedAmount
        pool
        id
        from
        blockTimestamp
        blockNumber
      }
      closeLongs(where: ${filterQuery}) {
        blockNumber
        blockTimestamp
        from
        id
        longAmount
        pool
        redeemedAmount
        transactionHash
        x
      }
      closeShorts(where: ${filterQuery}) {
        blockNumber
        blockTimestamp
        from
        id
        pool
        redeemedAmount
        shortAmount
        transactionHash
      }
    }
    `;
    const result = await this.urqlClient.query<UserTx>(QUERY, {});
    if (result.data == null) {
      return {
        addLiquidities: [],
        openLongs: [],
        openShorts: [],
        removeLiquidities: [],
        closeLongs: [],
        closeShorts: []
      };
    }
    return result.data;
  }

  public async getUserOpenPositions(
    user: `0x${string}`,
    pool: `0x${string}`
  ): Promise<UserOpenPositions> {
    const filterQuery = `{from: "${user}", pool: "${pool}"}`;
    const QUERY = `
    query MyQuery {
      openLongs(where: ${filterQuery}) {
        R
        alpha
        amount
        beta
        blockNumber
        blockTimestamp
        from
        id
        longAmount
        pool
        transactionHash
        x
      }
      openShorts(where: ${filterQuery}) {
        R
        alpha
        amount
        beta
        blockNumber
        blockTimestamp
        from
        id
        pool
        shortAmount
        transactionHash
        x
      }
    }
    `;
    const result = await this.urqlClient.query<UserOpenPositions>(QUERY, {});
    if (result.data == null) {
      return {
        openLongs: [],
        openShorts: []
      };
    }
    return result.data;
  }
}
