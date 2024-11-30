import {
  AnyVariables,
  Client,
  OperationResult,
  cacheExchange,
  fetchExchange,
  gql
} from "@urql/core";
import { graphql } from "./gql";

import {
  HourBar,
  PoolStatus,
  CurrentUserPosition,
  UserTxHistory,
  TxHistory,
  MinBar,
  PoolInfoArray,
  MonthlyInfoArray,
  DailyInfoArray,
  MonthlyInfo,
  FundingStateArray,
  PowerArray,
  OraclePriceArray,
  PoolCreationHistoryArray,
  PoolCreated,
  CurrentLpPosition,
  CurrentUserPositionAllPools,
  UserPoint,
  UserPoints,
  UserPointRank,
  UserPointsPagination,
  UserPtHistory,
  UserPointHistory,
  UserCloseHistoryPagination,
  UserCloseHistory,
  RewardHistoryReturnType
} from "./interfaces/ponder.interface";
import BN, { BigNumber } from "bignumber.js";
import { denorm, norm } from "./utils/decimals";

export type Cursor<EntityName extends string, Item> = Record<
  EntityName,
  {
    items: Item[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
    };
  }
>;

export default class PonderClient {
  private urqlClient: Client;

  constructor(graphEndpoint: string) {
    this.urqlClient = new Client({
      url: graphEndpoint,
      exchanges: [fetchExchange]
    });
  }

  public async getMinBars(
    pool: string,
    from: number,
    to: number,
    isLong: boolean,
    resolution?: string
  ): Promise<MinBar[]> {
    let entityName = "shortMinuteBars";
    if (isLong) {
      entityName = "longMinuteBars";
    }
    const QUERY = `
    query MyQuery {
        ${entityName}(
          orderBy: "timestamp"
          where: {pool: "${pool}", timestamp_gte: ${from}, timestamp_lt: ${to}}
          limit: 300
        ) {
          items {
            timestamp
            average
            close
            count
            pool
            open
            low
            high
            id
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }
    `;

    let result;
    if (isLong) {
      result = await this.urqlClient.query<Cursor<"longMinuteBars", MinBar>>(
        QUERY,
        {}
      );
      if (result.data == null) {
        throw new Error("No data found");
      }
      return result.data.longMinuteBars.items;
    } else {
      result = await this.urqlClient.query<Cursor<"shortMinuteBars", MinBar>>(
        QUERY,
        {}
      );
      if (result.data == null) {
        throw new Error("No data found");
      }
      return result.data.shortMinuteBars.items;
    }
  }

  public async getMyPools(user: string) {
    if (user === "") {
      throw new Error("user is empty");
    }

    const QUERY = `
    query MyQuery($user: String) {
      userLiqPositions(where: { amount_gt: "0", user: $user }) {
        items {
          amount
          id
          pool
          user
        }
      }
    }
    `;
    const result = await this.urqlClient.query<
      Cursor<
        "userLiqPositions",
        { amount: string; id: string; pool: string; user: string }
      >
    >(QUERY, { user: user });

    if (result.data == null) {
      throw new Error(
        `no data found for user ${user} while calling userLiqPositions`
      );
    }

    return {
      user: user,
      pools: result.data.userLiqPositions.items
    };
  }

  public async get30DFunding(pool: string) {
    const query = graphql(`
      query GetFundingFee($pool: String, $dateLte: BigInt, $dateGte: BigInt) {
        dailyLpFeess(
          where: { pool: $pool, date_lte: $dateLte, date_gte: $dateGte }
        ) {
          items {
            feePerToken
            feePercent
            date
            id
            lpQty
            newLiq
            pool
            liq
          }
        }
      }
    `);

    const now = new Date();
    const date = new Date();
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    const daysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    const lastMonth = new Date(date.getTime() - daysInMilliseconds);

    const resp = await this.urqlClient.query(query, {
      pool: pool,
      dateLte: now.getTime(),
      dateGte: lastMonth.getTime()
    });

    if (resp.data == null) {
      throw new Error(
        `no data found for pool ${pool} while calling dailyLpFeess`
      );
    }

    const feeSum = resp.data.dailyLpFeess.items.reduce(
      (accumulator, currentVal) => {
        return {
          feePerToken: accumulator.feePerToken + Number(currentVal.feePerToken),
          feePercent: accumulator.feePercent * Number(currentVal.feePercent)
        };
      },
      {
        feePerToken: 0,
        feePercent: 1
      }
    );

    feeSum.feePercent = (feeSum.feePercent - 1) * 100;

    return feeSum;
  }

  public async getNextTime(
    from: number,
    pool: string,
    isLong: boolean
  ): Promise<number | undefined> {
    const entity = isLong ? "longMinuteBars" : "shortMinuteBars";
    const QUERY = `
    query MyQuery {
      ${entity}(
        orderBy: "timestamp"
        where: { pool: "${pool}", timestamp_lt: ${from} }
        limit: 1
        orderDirection: "desc"
      ) {
        items {
          timestamp
          average
          close
          count
          pool
          open
          low
          high
          id
        }
      }
    }`;

    const result = await this.urqlClient.query<Cursor<typeof entity, MinBar>>(
      QUERY,
      {}
    );

    if (result.data == null) {
      throw new Error("No data found");
    }

    if (result.data[entity].items.length === 0) {
      return;
    }

    return result.data[entity].items[0].timestamp;
  }

  public async getHourBars(
    pool: string,
    from: number,
    to: number,
    isLong: boolean,
    resolution?: string
  ): Promise<HourBar[]> {
    let entityName = "shortHourBars";
    if (isLong) {
      entityName = "longHourBars";
    }
    const QUERY = `
    query MyQuery {
        ${entityName}(
          orderBy: "timestamp"
          where: {pool: "${pool}", timestamp_gte: ${from}, timestamp_lt: ${to}}
        ) {
          items {
            timestamp
            average
            close
            count
            pool
            open
            low
            high
            id
          }
        }
      }
    `;

    let result;
    if (isLong) {
      result = await this.urqlClient.query<{
        longHourBars: { items: HourBar[] };
      }>(QUERY, {});
      if (result.data == null) {
        throw new Error("No data found");
      }
      return result.data.longHourBars.items;
    } else {
      result = await this.urqlClient.query<{
        shortHourBars: { items: HourBar[] };
      }>(QUERY, {});
      if (result.data == null) {
        throw new Error("No data found");
      }
      return result.data.shortHourBars.items;
    }
  }

  public async getOpenCloseOrders(pool: string): Promise<TxHistory> {
    const filterQuery = `{pool: "${pool}"} orderBy: "blockTimestamp" orderDirection: "desc"`;
    const QUERY = `
    query MyQuery {
      openLongs(
        where: ${filterQuery}
      ) {
        items {
          R
          alpha
          amount
          beta
          blockTimestamp
          blockNumber
          fee
          from
          id
          longAmount
          pool
          transactionHash
          x
          oraclePrice
        }
      }
      openShorts(
        where: ${filterQuery}
      ) {
        items {
          R
          alpha
          amount
          beta
          blockTimestamp
          blockNumber
          fee
          from
          id
          shortAmount
          pool
          transactionHash
          x
          oraclePrice
        }
      }
      closeLongs(
        where: ${filterQuery}
      ) {
        items {
          blockNumber
          blockTimestamp
          from
          id
          longAmount
          pool
          redeemedAmount
          transactionHash
          x
          oraclePrice
        }
      }
      closeShorts(
        where: ${filterQuery}
      ) {
        items {
          blockNumber
          blockTimestamp
          from
          id
          shortAmount
          pool
          redeemedAmount
          transactionHash
          x
          oraclePrice
        }
      }
    }
    `;

    const result: OperationResult<TxHistory, AnyVariables> =
      await this.urqlClient.query<TxHistory>(QUERY, {});
    if (result.data == null) {
      return {
        openLongs: { items: [] },
        openShorts: { items: [] },
        closeLongs: { items: [] },
        closeShorts: { items: [] }
      };
    }
    return result.data;
  }

  public async getUserTxHistory(
    user: string,
    pool?: string
  ): Promise<UserTxHistory> {
    if (user === "") {
      throw new Error("user is empty");
    }

    const QUERY = `
    query MyQuery($pool: String, $user: String) {
      addLiquiditys(
        where: {from: $user, pool: $pool} orderBy: "blockTimestamp", orderDirection: "desc"
      ) {
        items {
          amount
          blockTimestamp
          blockNumber
          from
          id
          lpAmount
          pool
          transactionHash
          x
          oraclePrice
        }
      }
      removeLiquiditys(
        where: {from: $user, pool: $pool} orderBy: "blockTimestamp", orderDirection: "desc"
      ) {
        items {
          x
          transactionHash
          shares
          redeemedAmount
          pool
          id
          from
          blockTimestamp
          blockNumber
          oraclePrice
        }
      }
      openLongs(
        where: {from: $user, pool: $pool} orderBy: "blockTimestamp", orderDirection: "desc"
      ) {
        items {
          R
          alpha
          amount
          beta
          blockTimestamp
          blockNumber
          fee
          from
          id
          longAmount
          pool
          transactionHash
          x
          oraclePrice
        }
      }
      openShorts(
        where: {from: $user, pool: $pool} orderBy: "blockTimestamp", orderDirection: "desc"
      ) {
        items {
          R
          alpha
          amount
          beta
          blockTimestamp
          blockNumber
          fee
          from
          id
          shortAmount
          pool
          transactionHash
          x
          oraclePrice
        }
      }
      closeLongs(
        where: {from: $user, pool: $pool} orderBy: "blockTimestamp", orderDirection: "desc"
      ) {
        items {
          blockNumber
          blockTimestamp
          from
          id
          longAmount
          pool
          redeemedAmount
          transactionHash
          x
          oraclePrice
        }
      }
      closeShorts(
        where: {from: $user, pool: $pool} orderBy: "blockTimestamp", orderDirection: "desc"
      ) {
        items {
          blockNumber
          blockTimestamp
          from
          id
          shortAmount
          pool
          redeemedAmount
          transactionHash
          x
          oraclePrice
        }
      }
    }
    `;

    const result: OperationResult<UserTxHistory, AnyVariables> =
      await this.urqlClient.query<UserTxHistory>(QUERY, {
        pool: pool,
        user: user
      });
    if (result.data == null) {
      return {
        addLiquiditys: { items: [] },
        openLongs: { items: [] },
        openShorts: { items: [] },
        removeLiquiditys: { items: [] },
        closeLongs: { items: [] },
        closeShorts: { items: [] }
      };
    }
    return result.data;
  }

  public async getUserPoolCreationHistory(
    user: string
  ): Promise<PoolCreationHistoryArray> {
    const filterQuery = `{poolOp: "${user}"}`;
    const QUERY = `
      query MyQuery {
        poolCreateds(
          where: ${filterQuery}
          orderDirection: "desc"
          orderBy: "blockTimestamp"
        ) {
          items {
            blockTimestamp
            id
            poolAddr
            poolOp
            transactionHash
            power
            underlyingAddress
            underlyingDecimals
            underlyingSymbol
            oraclePrice
          }
        }
      }
    `;

    let res: OperationResult<PoolCreationHistoryArray, AnyVariables> =
      await this.urqlClient.query<PoolCreationHistoryArray>(QUERY, {});
    if (res.data == null) {
      throw new Error("No data found");
    }
    const e = new Date().getTime();
    return res.data;
  }

  public async getCurrentUserPositions(
    pool: string,
    user: string
  ): Promise<CurrentUserPosition> {
    const longId: string = user.concat(pool).concat("L");
    const shortId: string = user.concat(pool).concat("S");
    const QUERY = `
      query MyQuery {
        userCurrentLongPos(id: "${longId}") {
        pool
        user
        staked
        counterLongAmt
        }
        userCurrentShortPos(id: "${shortId}") {
        pool
        user
        staked
        counterShortAmt
        }
      }
    `;

    let res: OperationResult<CurrentUserPosition, AnyVariables> =
      await this.urqlClient.query<CurrentUserPosition>(QUERY, {});
    if (res.data == null) {
      throw new Error("No data found");
    }
    return res.data;
  }

  public async getCurrentUserPositionsAllPools(
    user: string
  ): Promise<CurrentUserPositionAllPools> {
    const QUERY = `
      query MyQuery {
        userCurrentShortPoss(
          where: { user: "${user}" }
        ) {
          items {
            counterShortAmt
            staked
            user
            pool
          }
        }
        userCurrentLongPoss(
        where: { user: "${user}" }
        ) {
          items {
            counterLongAmt
            pool
            staked
            user
          }
        }
      }
    `;

    let res: OperationResult<CurrentUserPositionAllPools, AnyVariables> =
      await this.urqlClient.query<CurrentUserPositionAllPools>(QUERY, {});
    if (res.data == null) {
      throw new Error("No data found");
    }
    return res.data;
  }

  public async getCurrentLpPositions(
    pool: string,
    user: string
  ): Promise<CurrentLpPosition> {
    const QUERY = `
      query MyQuery {
        userCurrentLpPoss(
          where: { user: "${user}", pool: "${pool}" }
        ) {
          items {
            counterLpAmt
            pool
            staked
            user
            lpTokenPriceUnderlying
            oraclePrice
          }
        }
      }
    `;

    let res: OperationResult<CurrentLpPosition, AnyVariables> =
      await this.urqlClient.query<CurrentLpPosition>(QUERY, {});
    if (res.data == null) {
      throw new Error("No data found");
    }
    return res.data;
  }

  // ****************************
  // *  Pool Related Functions  *
  // ****************************

  public async getPoolStatus(pool: string) {
    const QUERY = graphql(`
      query MyQuery($pool: String) {
        poolStateCurrents(where: { id: $pool }) {
          items {
            alpha
            beta
            id
            k
            longTokenAddress
            longTokenPrice
            longTokenSupply
            lpTokenSupply
            phi
            oraclePrice
            psi
            reserve
            shortTokenAddress
            shortTokenPrice
            shortTokenSupply
            x
          }
        }
      }
    `);

    let res = await this.urqlClient.query(QUERY, { pool: pool });

    if (res.data == null) {
      throw new Error("No data found");
    }
    return res.data;
  }

  public async getLPTokenPrice(pool: string): Promise<BigNumber> {
    const state = await this.getPoolStatus(pool);
    const { reserve, lpTokenSupply, phi, psi } =
      state.poolStateCurrents.items[0];

    const liquidity = BN(reserve.toString())
      .minus(BN(phi.toString()))
      .minus(BN(psi.toString()));

    if (lpTokenSupply === "0") {
      return BigNumber(0);
    }

    const lpPrice = liquidity.dividedBy(BN(lpTokenSupply));
    return lpPrice;
  }

  // FIXME: amount could be in underlying decimals
  public async estimatePositionPTokenOut(
    pool: `0x${string}`,
    underlyingAmount: string,
    isLong: boolean
  ): Promise<string> {
    const state = await this.getPoolStatus(pool);
    const poolInfo = await this.getPool(pool);
    // uint256 longAmount = (longSupply == 0) ? amt : (longSupply * amt) / toUint(phi);
    const { longTokenSupply, shortTokenSupply, phi, psi } =
      state.poolStateCurrents.items[0];

    const outInUnderlying = (() => {
      if (isLong) {
        if (longTokenSupply === "0") {
          return BN(underlyingAmount);
        }
        return BN(longTokenSupply)
          .multipliedBy(BN(underlyingAmount))
          .dividedBy(BN(phi.toString()));
      } else {
        if (shortTokenSupply === "0") {
          return BN(underlyingAmount);
        }
        return BN(shortTokenSupply)
          .multipliedBy(BN(underlyingAmount))
          .dividedBy(BN(psi.toString()));
      }
    })();

    // return the normalized as the PToken is in 18
    return norm(
      outInUnderlying,
      Number(poolInfo.underlyingDecimals.toString())
    ).toString();
  }

  public async estimatePositionUnderlyingOut(
    pool: `0x${string}`,
    pTokenAmount: string,
    isLong: boolean
  ): Promise<string> {
    const state = await this.getPoolStatus(pool);
    const poolInfo = await this.getPool(pool);
    // uint256 longAmount = (longSupply == 0) ? amt : (longSupply * amt) / toUint(phi);
    const { longTokenSupply, shortTokenSupply, phi, psi } =
      state.poolStateCurrents.items[0];

    const outIn18 = (() => {
      if (isLong) {
        return BN(BN(phi.toString()))
          .multipliedBy(BN(pTokenAmount))
          .dividedBy(BN(longTokenSupply));
      } else {
        return BN(BN(psi.toString()))
          .multipliedBy(BN(pTokenAmount))
          .dividedBy(BN(shortTokenSupply));
      }
    })();

    // return the normalized as the PToken is in 18
    return denorm(
      outIn18,
      Number(poolInfo.underlyingDecimals.toString())
    ).toString();
  }

  public async estimateLiqLPOut(
    pool: `0x${string}`,
    underlyingAmount: string
  ): Promise<string> {
    const state = await this.getPoolStatus(pool);
    const poolInfo = await this.getPool(pool);
    const { reserve, lpTokenSupply, phi, psi } =
      state.poolStateCurrents.items[0];

    const liquidity = BN(reserve.toString())
      .minus(BN(phi.toString()))
      .minus(BN(psi.toString()));

    if (lpTokenSupply === "0") {
      return underlyingAmount;
    }

    const outInUnderlying = BN(underlyingAmount)
      .multipliedBy(BN(lpTokenSupply))
      .dividedBy(liquidity);

    return norm(
      outInUnderlying,
      Number(poolInfo.underlyingDecimals.toString())
    ).toString();
  }

  public async estimateLiqUnderlyingOut(
    pool: `0x${string}`,
    lpAmount: string
  ): Promise<string> {
    const state = await this.getPoolStatus(pool);
    const poolInfo = await this.getPool(pool);
    const { reserve, lpTokenSupply, phi, psi } =
      state.poolStateCurrents.items[0];

    const liquidity = BN(reserve.toString())
      .minus(BN(phi.toString()))
      .minus(BN(psi.toString()));

    if (lpTokenSupply === "0") {
      return lpAmount;
    }

    // UD redeemAmountUD = (ud(_shares) * liquidity(x)) / ud(lpPToken.totalSupply());
    const normalizeOut = BN(lpAmount)
      .multipliedBy(liquidity)
      .dividedBy(BN(lpTokenSupply));

    // Denormalize the output to underlying's decimal
    return denorm(
      normalizeOut,
      Number(poolInfo.underlyingDecimals.toString())
    ).toString();
  }

  public async getPower(pool: string): Promise<PowerArray> {
    const filterQuery = `{poolAddr: "${pool}"}`;
    const QUERY = `
        query MyQuery {
          poolCreateds (where: ${filterQuery}) {
            items {
            power
            }
          }
        }
    `;

    let res: OperationResult<PowerArray, AnyVariables> =
      await this.urqlClient.query<PowerArray>(QUERY, {});

    if (res.data == null) {
      throw new Error("No data found");
    }
    return res.data;
  }

  public async getOraclePrice(pool: string): Promise<OraclePriceArray> {
    const filterQuery = `{id: "${pool}"}`;
    const QUERY = `
        query MyQuery {
          poolStateCurrents(where: ${filterQuery}) {
            items {
            oraclePrice
            }
          }
        }
    `;

    let res: OperationResult<OraclePriceArray, AnyVariables> =
      await this.urqlClient.query<OraclePriceArray>(QUERY, {});

    if (res.data == null) {
      throw new Error("No data found");
    }
    return res.data;
  }

  public async getPools(): Promise<PoolInfoArray> {
    const QUERY = `
    query MyQuery {
      poolCreateds {
        items {
          underlyingSymbol
          underlyingDecimals
          underlyingAddress
          power
          transactionHash
          poolOp
          blockTimestamp
          id
          poolAddr
          blockNumber
        }
      }
    }`;

    let res: OperationResult<PoolInfoArray, AnyVariables> =
      await this.urqlClient.query<PoolInfoArray>(QUERY, {});
    if (res.data == null) {
      throw new Error("No data found");
    }
    return res.data;
  }

  public async getPool(pool: `0x${string}`): Promise<PoolCreated> {
    const filterQuery = `{poolAddr: "${pool}"}`;
    const QUERY = `
    query MyQuery {
      poolCreateds(where: ${filterQuery}) {
        items {
          poolAddr
          power
          transactionHash
          id
          blockNumber
          blockTimestamp
          poolOp
          underlyingAddress
          underlyingDecimals
          underlyingSymbol
        }
      }
    }`;

    let res: OperationResult<PoolInfoArray, AnyVariables> =
      await this.urqlClient.query<PoolInfoArray>(QUERY, {});
    if (res.data == null) {
      throw new Error("No data found");
    }
    return res.data.poolCreateds.items[0];
  }

  public async getMonthlyInfo(pool: string): Promise<MonthlyInfoArray> {
    const filterQuery = `{pool: "${pool}"}`;
    const QUERY = `
     query MyQuery {
        monthlyInfos(
        where: ${filterQuery}
          orderBy: "date"
          orderDirection: "desc"
        ) {
          items {
            date
            fee
            id
            pool
            volume
          }
        }
      }    
    `;

    let res: OperationResult<MonthlyInfoArray, AnyVariables> =
      await this.urqlClient.query<MonthlyInfoArray>(QUERY, {});
    if (res.data == null) {
      throw new Error("No data found");
    }
    return res.data;
  }

  public async getDailyInfo(pool: string): Promise<DailyInfoArray> {
    const filterQuery = `{pool: "${pool}"}`;
    const QUERY = `
     query MyQuery {
        dailyInfos(
        where: ${filterQuery}
          orderBy: "date"
          orderDirection: "desc"
          limit: 2
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

    let res: OperationResult<DailyInfoArray, AnyVariables> =
      await this.urqlClient.query<DailyInfoArray>(QUERY, {});
    if (res.data == null) {
      throw new Error("No data found");
    }
    return res.data;
  }

  public async getRawDailyData(
    pool: string,
    from: number,
    to: number
  ): Promise<DailyInfoArray> {
    const QUERY = graphql(`
      query GetRawDailyData($pool: String, $dateGte: BigInt, $dateLte: BigInt) {
        dailyInfos(
          where: { pool: $pool, date_lte: $dateLte, date_gte: $dateGte }
          orderBy: "date"
          orderDirection: "asc"
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
    `);

    let res: OperationResult<DailyInfoArray, AnyVariables> =
      await this.urqlClient.query<DailyInfoArray>(QUERY, {
        pool: pool,
        dateGte: from,
        dateLte: to
      });
    if (res.data == null) {
      throw new Error("No data found");
    }
    return res.data;
  }

  public async getLastMonthData(
    pool: string
  ): Promise<MonthlyInfo | undefined> {
    const data = await this.getMonthlyInfo(pool);
    if (data.monthlyInfos.items.length > 0) {
      return data.monthlyInfos.items.at(0);
    }
    return undefined;
  }

  public async getFundingStatus(pool: string): Promise<FundingStateArray> {
    const filterQuery = `{pool: "${pool}"}`;
    const QUERY = `
      query MyQuery {
        fundingStates(
        where: ${filterQuery}
        ) {
          items {
            dt
            h
            id
            liquidity
            newLiquidity
            newPhi
            newPsi
            pool
            x
            psi
            phi
          }
        }
      }
    `;

    let res: OperationResult<FundingStateArray, AnyVariables> =
      await this.urqlClient.query<FundingStateArray>(QUERY, {});
    if (res.data == null) {
      throw new Error("No data found");
    }
    return res.data;
  }

  public async getUserPoints(user: string): Promise<UserPointRank | undefined> {
    const QUERY = `
      query MyQuery($after: String) {
        userPoints(orderBy: "points", orderDirection: "desc", limit: 1000, after: $after) {
          items {
            points
            id
            volume
            profit
          }
          pageInfo {
            hasNextPage,
            endCursor
          }
        }
      }
    `;

    let allPoints: UserPoint[] = [];
    let hasNextPage = true;
    let after: string | null = null;

    while (hasNextPage) {
      let res: OperationResult<UserPointsPagination, AnyVariables> =
        await this.urqlClient.query<UserPointsPagination>(QUERY, { after });

      if (res.data == null) {
        throw new Error("No data found");
      }

      allPoints = allPoints.concat(res.data.userPoints.items);
      hasNextPage = res.data.userPoints.pageInfo.hasNextPage;
      after = res.data.userPoints.pageInfo.endCursor;
    }

    const rank = allPoints.findIndex(
      (item) => item.id.toLowerCase() === user.toLowerCase()
    );

    if (rank !== -1) {
      const userPt = allPoints.at(rank)!;
      const userPtRank: UserPointRank = { ...userPt, rank: rank + 1 };
      return userPtRank;
    }
  }

  public async getRanks(): Promise<UserPoint[]> {
    const QUERY = `
    query MyQuery {
      userPoints(orderBy: "points", orderDirection: "desc") {
        items {
          points
          id
          volume
          profit
        } 
      }
    }
  `;

    let res: OperationResult<UserPoints, AnyVariables> =
      await this.urqlClient.query<UserPoints>(QUERY, {});

    if (res.data == null) {
      throw new Error("No data found");
    }

    const points: UserPoint[] = res.data.userPoints.items;

    return points;
  }

  public async getTradeSizes(address: string): Promise<number | undefined> {
    const filterQuery = `{user: "${address}"}`;
    const QUERY = `
      query MyQuery($cursor:String) {
        userCloseHistorys(where: ${filterQuery}, after: $cursor, limit: 1000) {
          items {
            id
            tradeSize
            user
          }
          pageInfo {
            hasNextPage
            startCursor
          }
        }
      }
    `;

    let allPoints: UserCloseHistory[] = [];
    let hasNextPage = true;
    let after: string | null = null;
    while (hasNextPage) {
      let res: OperationResult<UserCloseHistoryPagination, AnyVariables> =
        await this.urqlClient.query<UserCloseHistoryPagination>(QUERY, {
          after
        });

      if (res.data == null) {
        throw new Error("No data found");
      }

      allPoints = allPoints.concat(res.data.userCloseHistorys.items);
      hasNextPage = res.data.userCloseHistorys.pageInfo.hasNextPage;
      after = res.data.userCloseHistorys.pageInfo.endCursor;
    }
    const sum = allPoints.reduce(
      (acc, num) => acc + parseFloat(num.tradeSize),
      0
    );

    return sum / allPoints.length;
  }

  public async getRewardHistory(
    address: string
  ): Promise<RewardHistoryReturnType> {
    const filterQuery = `{user: "${address}"}`;
    const QUERY = `
      query MyQuery($cursor:String) {
        userPointHistorys(where: ${filterQuery}, after: $cursor, orderBy: "timestamp", orderDirection: "desc", limit: 1000) {
          items {
            action
            id
            profit
            points
            user
            timestamp
          } pageInfo {
            hasNextPage
            startCursor
            
          }
        }
      }
    `;

    let allPoints: UserPointHistory[] = [];
    let hasNextPage = true;
    let after: string | null = null;

    while (hasNextPage) {
      let res: OperationResult<UserPtHistory, AnyVariables> =
        await this.urqlClient.query<UserPtHistory>(QUERY, {});
      if (res.data == null) {
        throw new Error("No data found");
      }
      allPoints = allPoints.concat(res.data.userPointHistorys.items);
      hasNextPage = res.data.userPointHistorys.pageInfo.hasNextPage;
      after = res.data.userPointHistorys.pageInfo.endCursor;
    }

    const parsedNums = allPoints.map((x) => parseFloat(x.profit));
    const largest = Math.max(...parsedNums);
    const smallest = Math.min(...parsedNums);

    // Returns the reward history ordered by timestamp latest first
    return {
      rewardHistory: allPoints,
      max: largest,
      min: smallest
    };
  }
}
