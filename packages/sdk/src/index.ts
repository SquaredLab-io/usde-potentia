import { WalletClient, getAddress } from "viem";
import PoolWrite from "./poolWrite";
import BigNumber from "bignumber.js";
import PonderClient from "./ponderClient";
import PotentiaPoolABI from "./abis/PotentiaPool.json";
import { TokenUnitPrice } from "./interfaces/pool.interface";
import { publicActionReverseMirage } from "reverse-mirage";
import {
  Tx,
  PoolInfo,
  OpenPositionInfo,
  PositionTab,
  FundingInfo,
  AllPositions,
} from "./interfaces/index.interface";
import { CurrentUserPosition, PoolStatus } from "./interfaces/ponder.interface";

import type {
  FundingStateArray,
  PoolInfoArray as PoolPonderInfo,
  UserCurrentLongPosition,
} from "./interfaces/ponder.interface";

export class PotentiaSdk {
  private publicClient;
  private walletClient!: WalletClient;
  public poolWrite!: PoolWrite;
  public ponderClient: PonderClient;
  public sqlChannelUrl: string;

  constructor(publicClient: any, ponderUrl: string, sqlChannelUrl: string) {
    this.publicClient = publicClient.extend(publicActionReverseMirage);
    this.ponderClient = new PonderClient(ponderUrl);
    this.sqlChannelUrl = sqlChannelUrl;
  }

  public async initialiseSDK(walletClient: WalletClient) {
    this.walletClient = walletClient;
    this.poolWrite = new PoolWrite(this.publicClient, this.walletClient);
  }

  public async getUnderlyingInfo(poolAddress: string) {
    const poolAddr = poolAddress as `0x${string}`;
    const tokenAddr: string = await this.publicClient.readContract({
      address: poolAddr,
      abi: PotentiaPoolABI,
      functionName: "underlying",
    });
    return await this.getERC20Info(tokenAddr as `0x${string}`);
  }

  public async getERC20Info(tokenAddress: string) {
    const tokenAddr = tokenAddress as `0x${string}`;
    return await this.publicClient.getERC20({
      erc20: {
        address: tokenAddr,
        chainID: this.publicClient.chain!.id,
      },
    });
  }

  public async fetchTokenPrice(poolAddress: string) {
    const dailyInfo = await this.ponderClient.getDailyInfo(poolAddress);
    const poolStatus = await this.ponderClient.getPoolStatus(poolAddress);

    let longDailyChange;
    let shortDailyChange;
    let lastLongP;
    let lastShortP;
    let previousLongP;
    let previousShortP;
    let volume;
    let volInDollars = "0";
    let tvl;

    const latestData = dailyInfo.dailyInfos.items.at(0);
    let previousData = dailyInfo.dailyInfos.items.at(1);
    volume = latestData?.volume || 0;
    tvl = latestData?.lastTvl || 0;

    const date = new Date();
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    const startDay = date.getTime();

    // NOTE: case when there is no tx on the day, so latestData will return yesterday's data
    if (BigInt(startDay) != latestData?.date) {
      volume = 0;
      previousData = dailyInfo.dailyInfos.items.at(0);
      tvl = 0;
    }

    const price = poolStatus.poolStateCurrents.items.at(0)?.oraclePrice;
    let oraclePrice;
    if (price == undefined) {
      throw Error("No data found");
    }
    oraclePrice = BigNumber(price.toString());
    const dollarPrice = oraclePrice.dividedBy(BigNumber(1e18));
    volInDollars = BigNumber(Number(volume) || 0)
      .multipliedBy(dollarPrice)
      .dividedBy(BigNumber(1e18))
      .toString();

    lastLongP = BigNumber(
      poolStatus.poolStateCurrents.items[0].longTokenPrice as string
    );
    lastShortP = BigNumber(
      poolStatus.poolStateCurrents.items[0].shortTokenPrice as string
    );
    previousLongP = BigNumber(previousData?.lastLongPrice as string);
    previousShortP = BigNumber(previousData?.lastShortPrice as string);

    longDailyChange = lastLongP
      .minus(previousLongP)
      .multipliedBy(100)
      .dividedBy(previousLongP);

    shortDailyChange = lastShortP
      .minus(previousShortP)
      .multipliedBy(100)
      .dividedBy(previousShortP);

    const fundingInfo: FundingInfo = await this.fundingInfo(poolAddress);

    return {
      lastLongP: lastLongP.toString(),
      longDailyChange: longDailyChange.toFixed(),
      lastShortP: lastShortP.toString(),
      shortDailyChange: shortDailyChange.toFixed(),
      fundingInfo: fundingInfo,
      volume: volume.toString(),
      dollarVol: volInDollars.toString(),
      tvl: tvl.toString(),
    };
  }

  // ************************
  // *  Migrated to Ponder  *
  // ************************

  public async getPools(): Promise<PoolInfo[]> {
    // const s = new Date().getTime();
    const poolsList: PoolPonderInfo = await this.ponderClient.getPools();
    const pools = await Promise.all(
      poolsList.poolCreateds.items.map(async (pool) => {
        const age = new Date(parseInt(pool.blockTimestamp.toString()) * 1000);

        const poolStatus: PoolStatus = await this.ponderClient.getPoolStatus(
          pool.poolAddr
        );

        const arr = poolStatus.poolStateCurrents.items;
        const { reserve, oraclePrice } = arr[0];
        let lastMonthInfo = await this.ponderClient.getLastMonthData(
          pool.poolAddr
        );

        if (lastMonthInfo === undefined) {
          lastMonthInfo = {
            id: "0",
            volume: 0n,
            fee: 0n,
            date: 0n,
            pool: pool.poolAddr,
          };
        }

        const poolInfo: PoolInfo = {
          tvl: reserve.toString(),
          age: age.toDateString(),
          vol: lastMonthInfo!.volume.toString(),
          fee: lastMonthInfo!.fee.toString(),
          lastMonthTimestamp: new Date(
            parseInt(lastMonthInfo!.date.toString())
          ).toDateString(),
          poolAddr: pool.poolAddr,
          underlying: pool.underlyingSymbol,
          underlyingAddress: pool.underlyingAddress,
          underlyingDecimals: Number(pool.underlyingDecimals),
          pool: `${pool.underlyingSymbol} / USDC`,
          power: Number(BigInt(pool.power) / 10n ** 18n),
          poolOp: pool.poolOp,
          oraclePrice: oraclePrice.toString(),
        };
        return poolInfo;
      })
    );
    return pools;
  }

  public async tokenUnitPrice(poolAddress: string): Promise<TokenUnitPrice> {
    const poolStatus: PoolStatus = await this.ponderClient.getPoolStatus(
      poolAddress
    );

    const arr = poolStatus.poolStateCurrents.items.at(0);
    const {
      id,
      x,
      phi,
      psi,
      reserve,
      longTokenAddress,
      shortTokenAddress,
      longTokenSupply,
      shortTokenSupply,
      longTokenPrice,
      shortTokenPrice,
    } = arr!;
    const longP = BigNumber(phi.toString());
    const shortP = BigNumber(psi.toString());
    const longUnitPrice = longP.dividedBy(BigNumber(longTokenSupply));
    const shortUnitPrice = shortP.dividedBy(BigNumber(shortTokenSupply));

    const tup: TokenUnitPrice = {
      long: {
        address: longTokenAddress,
        price: longUnitPrice,
        payoff: longP,
        supply: longTokenSupply,
      },
      short: {
        address: shortTokenAddress,
        price: shortUnitPrice,
        payoff: shortP,
        supply: shortTokenSupply,
      },
    };

    return tup;
  }

  public async fundingInfo(poolAddress: string): Promise<FundingInfo> {
    const fundingStateArray: FundingStateArray =
      await this.ponderClient.getFundingStatus(poolAddress);

    const item = fundingStateArray.fundingStates.items.at(0);
    if (item === undefined) {
      return {
        longF: BigNumber(0),
        shortF: BigNumber(0),
        liquidityF: BigNumber(0),
      };
    }

    const phi = BigNumber(item.phi.toString());
    const psi = BigNumber(item.psi.toString());
    const newPhi = BigNumber(item.newPhi.toString());
    const newPsi = BigNumber(item.newPsi.toString());
    const liquidity = BigNumber(item.liquidity.toString());
    const newLiquidity = BigNumber(item.newLiquidity.toString());

    return {
      longF: newPhi.minus(phi).multipliedBy(100).dividedBy(phi),
      shortF: newPsi.minus(psi).multipliedBy(100).dividedBy(psi),
      liquidityF: newLiquidity
        .minus(liquidity)
        .multipliedBy(100)
        .dividedBy(liquidity),
    };
  }

  public async getTradeHistory(pool: `0x${string}`): Promise<Tx[]> {
    const underlying = await this.getUnderlyingInfo(pool);

    const powerArray = await this.ponderClient.getPower(pool);
    const power = Number(powerArray.poolCreateds.items.at(0)?.power);

    const result = await this.ponderClient.getOpenCloseOrders(pool);

    const openLongsTxs = result.openLongs.items.map((tx) => {
      return {
        underlying: underlying,
        pool: `${underlying.symbol} / USDC`,
        poolAddress: tx.pool,
        power: power,
        dateTime: tx.blockTimestamp,
        size: BigInt(tx.longAmount),
        hash: tx.transactionHash,
        action: "OL",
        oraclePrice: tx.oraclePrice,
        lp: tx.longAmount,
        underlyingSize: tx.amount,
      } as Tx;
    });

    const openShortsTxs = result.openShorts.items.map((tx) => {
      return {
        underlying: underlying,
        pool: `${underlying.symbol} / USDC`,
        poolAddress: tx.pool,
        power: power,
        dateTime: tx.blockTimestamp,
        size: BigInt(tx.shortAmount),
        hash: tx.transactionHash,
        action: "OS",
        oraclePrice: tx.oraclePrice,
        lp: tx.shortAmount,
        underlyingSize: tx.amount,
      } as Tx;
    });

    const closeLongTxs = result.closeLongs.items.map((tx) => {
      return {
        underlying: underlying,
        pool: `${underlying.symbol} / USDC`,
        poolAddress: tx.pool,
        power: power,
        dateTime: tx.blockTimestamp,
        size: BigInt(tx.redeemedAmount),
        hash: tx.transactionHash,
        action: "CL",
        oraclePrice: tx.oraclePrice,
        lp: tx.longAmount,
        underlyingSize: tx.redeemedAmount,
      } as Tx;
    });

    const closeShortTxs = result.closeShorts.items.map((tx) => {
      return {
        underlying: underlying,
        pool: `${underlying.symbol} / USDC`,
        poolAddress: tx.pool,
        power: power,
        dateTime: tx.blockTimestamp,
        size: BigInt(tx.redeemedAmount),
        hash: tx.transactionHash,
        action: "CS",
        oraclePrice: tx.oraclePrice,
        lp: tx.shortAmount,
        underlyingSize: tx.redeemedAmount,
      } as Tx;
    });

    const txs: Tx[] = [
      ...closeLongTxs,
      ...closeShortTxs,
      ...openLongsTxs,
      ...openShortsTxs,
    ];

    return txs;
  }

  // public async openFetchOrders(pool?: string): Promise<PositionTab> {
  //   const [address] = await this.walletClient.getAddresses();
  //   const poolAddr = pool as `0x${string}`;

  //   // return types
  //   let longPosTab: OpenPositionInfo | undefined;
  //   let shortPosTab: OpenPositionInfo | undefined;

  //   const currentOrders: CurrentUserPosition | null =
  //     await this.ponderClient.getCurrentUserPositions(pool!, address);

  //   const tokenUnitPrice: TokenUnitPrice = await this.tokenUnitPrice(pool!);
  //   const { long: L, short: S } = tokenUnitPrice;
  //   const { address: longAddress, payoff: longP, supply: longSup } = L;
  //   const { address: shortAddress, payoff: shortP, supply: shortSup } = S;

  //   const oraclePriceArray = await this.ponderClient.getOraclePrice(poolAddr);

  //   const oraclePriceItem = oraclePriceArray.poolStateCurrents.items.at(0);
  //   const price = oraclePriceItem?.oraclePrice;
  //   let oraclePrice;
  //   if (price == undefined) {
  //     throw Error("No data found");
  //   }
  //   oraclePrice = BigNumber(price.toString());

  //   const dollarPrice = oraclePrice.dividedBy(BigNumber(1e18));

  //   let noLongPos;
  //   let noShortPos;
  //   const { userCurrentLongPos, userCurrentShortPos } = currentOrders;
  //   if (userCurrentLongPos == null) {
  //     noLongPos = true;
  //   }
  //   if (userCurrentShortPos == null) {
  //     noShortPos = true;
  //   }
  //   let longBalance;
  //   let shortBalance;
  //   if (!noLongPos) {
  //     longBalance = userCurrentLongPos.counterLongAmt;
  //     const LPV = longP.multipliedBy(longBalance).dividedBy(BigNumber(longSup));

  //     const { staked: underlyingStakedLongAmt } = userCurrentLongPos;
  //     let longFlag = false;
  //     // let longNumerator = BigNumber(underlyingStakedLongAmt).minus(LPV);
  //     let longNumerator = LPV.minus(underlyingStakedLongAmt);
  //     const longPercent = longNumerator
  //       .multipliedBy(BigNumber(100))
  //       .dividedBy(BigNumber(underlyingStakedLongAmt));
  //     if (longPercent.gt(0)) {
  //       longFlag = true;
  //     }
  //     longPosTab = {
  //       underlyingPrice: dollarPrice.toString(),
  //       underlyingSize: underlyingStakedLongAmt,
  //       tokenSize: longBalance,
  //       positionValueInUnderlying: LPV.toString(),
  //       side: "Long",
  //       profit: longFlag,
  //       PAndLPercent: longPercent.toString(),
  //       PAndLAmtInDollars: longNumerator
  //         .multipliedBy(dollarPrice)
  //         .dividedBy(BigNumber(1e18))
  //         .toString(),
  //     };
  //   }
  //   if (!noShortPos) {
  //     shortBalance = userCurrentShortPos.counterShortAmt;

  //     const SPV = shortP
  //       .multipliedBy(shortBalance)
  //       .dividedBy(BigNumber(shortSup));

  //     const { staked: underlyingStakedShortAmt } = userCurrentShortPos;
  //     let shortFlag = false;
  //     // let shortNumerator = BigNumber(underlyingStakedShortAmt).minus(SPV);
  //     let shortNumerator = SPV.minus(underlyingStakedShortAmt);
  //     const shortPercent = shortNumerator
  //       .multipliedBy(BigNumber(100))
  //       .dividedBy(BigNumber(underlyingStakedShortAmt));
  //     if (shortPercent.gt(0)) {
  //       shortFlag = true;
  //     }
  //     shortPosTab = {
  //       underlyingPrice: dollarPrice.toString(),
  //       underlyingSize: underlyingStakedShortAmt,
  //       tokenSize: shortBalance,
  //       positionValueInUnderlying: SPV.toString(),
  //       side: "Short",
  //       profit: shortFlag,
  //       PAndLPercent: shortPercent.toString(),
  //       PAndLAmtInDollars: shortNumerator
  //         .multipliedBy(dollarPrice)
  //         .dividedBy(BigNumber(1e18))
  //         .toString(),
  //     };
  //   }

  //   const posTab: PositionTab = {
  //     longPositionTab: longPosTab,
  //     shortPositionTab: shortPosTab,
  //   };
  //   return posTab;
  // }

  public async openOrders(): Promise<AllPositions> {
    const [address] = await this.walletClient.getAddresses();

    const currentOrders =
      await this.ponderClient.getCurrentUserPositionsAllPools(address);

    const { userCurrentLongPoss, userCurrentShortPoss } = currentOrders;
    const { items: longPosArray } = userCurrentLongPoss;
    const { items: shortPosArray } = userCurrentShortPoss;
    let longPositions: OpenPositionInfo[] = [];
    let shortPositions: OpenPositionInfo[] = [];

    if (longPosArray.length != 0) {
      for (let position of longPosArray) {
        const longBalance = position.counterLongAmt;
        if (BigInt(longBalance) === 0n) continue;
        const poolAddress = getAddress(position.pool);

        const tokenUnitPrice: TokenUnitPrice = await this.tokenUnitPrice(
          poolAddress
        );

        const { long: L, short: S } = tokenUnitPrice;
        const { address: longAddress, payoff: longP, supply: longSup } = L;

        const oraclePriceArray = await this.ponderClient.getOraclePrice(
          poolAddress
        );

        const oraclePriceItem = oraclePriceArray.poolStateCurrents.items.at(0);
        const price = oraclePriceItem?.oraclePrice;
        let oraclePrice;
        if (price == undefined) {
          throw Error("No data found");
        }
        oraclePrice = BigNumber(price.toString());

        const dollarPrice = oraclePrice.dividedBy(BigNumber(1e18));

        const LPV = longP
          .multipliedBy(longBalance)
          .dividedBy(BigNumber(longSup));
        let longFlag = false;
        let longNumerator = LPV.minus(position.staked);
        const longPercent = longNumerator
          .multipliedBy(BigNumber(100))
          .dividedBy(BigNumber(position.staked));
        if (longPercent.gt(0)) {
          longFlag = true;
        }

        const longPosTab: OpenPositionInfo = {
          pool: poolAddress,
          underlyingPrice: dollarPrice.toString(),
          underlyingSize: position.staked,
          tokenSize: longBalance,
          positionValueInUnderlying: LPV.toString(),
          side: "Long",
          profit: longFlag,
          PAndLPercent: longPercent.toString(),
          PAndLAmtInDollars: longNumerator
            .multipliedBy(dollarPrice)
            .dividedBy(BigNumber(1e18))
            .toString(),
        };

        longPositions.push(longPosTab);
      }
    }

    if (shortPosArray.length != 0) {
      for (let position of shortPosArray) {
        const shortBalance = position.counterShortAmt;
        if (BigInt(shortBalance) === 0n) continue;
        const poolAddress = getAddress(position.pool);

        const tokenUnitPrice: TokenUnitPrice = await this.tokenUnitPrice(
          poolAddress
        );

        const { long: L, short: S } = tokenUnitPrice;
        const { address: shortAddress, payoff: shortP, supply: shortSup } = S;

        const oraclePriceArray = await this.ponderClient.getOraclePrice(
          poolAddress
        );

        const oraclePriceItem = oraclePriceArray.poolStateCurrents.items.at(0);
        const price = oraclePriceItem?.oraclePrice;
        let oraclePrice;
        if (price == undefined) {
          throw Error("No data found");
        }
        oraclePrice = BigNumber(price.toString());

        const dollarPrice = oraclePrice.dividedBy(BigNumber(1e18));

        const SPV = shortP
          .multipliedBy(shortBalance)
          .dividedBy(BigNumber(shortSup));

        let shortFlag = false;
        let shortNumerator = SPV.minus(position.staked);
        const shortPercent = shortNumerator
          .multipliedBy(BigNumber(100))
          .dividedBy(BigNumber(position.staked));

        if (shortPercent.gt(0)) {
          shortFlag = true;
        }
        const shortPosTab = {
          pool: poolAddress,
          underlyingPrice: dollarPrice.toString(),
          underlyingSize: position.staked,
          tokenSize: shortBalance,
          positionValueInUnderlying: SPV.toString(),
          side: "Short",
          profit: shortFlag,
          PAndLPercent: shortPercent.toString(),
          PAndLAmtInDollars: shortNumerator
            .multipliedBy(dollarPrice)
            .dividedBy(BigNumber(1e18))
            .toString(),
        };

        shortPositions.push(shortPosTab);
      }
    }

    return {
      longPositions,
      shortPositions,
    };
  }

  public async getP(pool: `0x${string}`) {
    const powerArray = await this.ponderClient.getPower(pool);
    const power = Number(powerArray.poolCreateds.items.at(0)?.power);
    return power;
  }

  public async getUserLiquidityHistory(user: `0x${string}`) {
    const addressToData: Map<string, { power: number; underlying: any }> =
      new Map();

    const result = await this.ponderClient.getUserTxHistory(user);

    const poolCreationResult =
      await this.ponderClient.getUserPoolCreationHistory(user);

    const poolCreationTx: Tx[] = await Promise.all(
      poolCreationResult.poolCreateds.items.map(async (tx) => {
        if (!addressToData.has(tx.poolAddr)) {
          addressToData.set(tx.poolAddr, {
            power: await this.getP(tx.poolAddr as `0x${string}`),
            underlying: await this.getUnderlyingInfo(tx.poolAddr),
          });
        }

        const { power, underlying } = addressToData.get(tx.poolAddr)!;
        return {
          underlying: underlying,
          pool: `${underlying.symbol} / USDC`,
          poolAddress: tx.poolAddr,
          power: Number(tx.power),
          dateTime: tx.blockTimestamp.toString(),
          size: BigInt(0),
          hash: tx.transactionHash,
          lp: "",
          underlyingSize: "",
          action: "PC",
          oraclePrice: tx.oraclePrice,
        };
      })
    );

    const addLiqTxs: Tx[] = await Promise.all(
      result.addLiquiditys.items.map(async (tx) => {
        if (!addressToData.has(tx.pool)) {
          addressToData.set(tx.pool, {
            power: await this.getP(tx.pool as `0x${string}`),
            underlying: await this.getUnderlyingInfo(tx.pool),
          });
        }

        const { power, underlying } = addressToData.get(tx.pool)!;
        return {
          underlying: underlying,
          pool: `${underlying.symbol} / USDC`,
          poolAddress: tx.pool,
          power: power,
          dateTime: tx.blockTimestamp,
          size: BigInt(tx.lpAmount),
          hash: tx.transactionHash,
          lp: tx.lpAmount,
          underlyingSize: tx.amount,
          action: "AL",
          oraclePrice: tx.oraclePrice,
        };
      })
    );

    const removeLiqTxs: Tx[] = await Promise.all(
      result.removeLiquiditys.items.map(async (tx) => {
        if (!addressToData.has(tx.pool)) {
          addressToData.set(tx.pool, {
            power: await this.getP(tx.pool as `0x${string}`),
            underlying: await this.getUnderlyingInfo(tx.pool),
          });
        }

        const { power, underlying } = addressToData.get(tx.pool)!;
        return {
          underlying: underlying,
          pool: `${underlying.symbol} / USDC`,
          poolAddress: tx.pool,
          power: power,
          dateTime: tx.blockTimestamp,
          size: BigInt(tx.redeemedAmount),
          hash: tx.transactionHash,
          lp: tx.shares,
          underlyingSize: tx.redeemedAmount,
          action: "RL",
          oraclePrice: tx.oraclePrice,
        };
      })
    );
    const txs: Tx[] = [...addLiqTxs, ...removeLiqTxs, ...poolCreationTx];

    txs.sort((a, b) => Number(b.dateTime) - Number(a.dateTime));
    return txs;
  }

  public async getUserTxHistory(pool: `0x${string}`, user: `0x${string}`) {
    const underlying = await this.getUnderlyingInfo(pool);

    const powerArray = await this.ponderClient.getPower(pool);
    const power = Number(powerArray.poolCreateds.items.at(0)?.power);

    const result = await this.ponderClient.getUserTxHistory(user, pool);

    const closeLongTxs = result.closeLongs.items.map((tx) => {
      return {
        underlying: underlying,
        pool: `${underlying.symbol} / USDC`,
        poolAddress: tx.pool,
        power: power,
        dateTime: tx.blockTimestamp,
        size: BigInt(tx.redeemedAmount),
        hash: tx.transactionHash,
        action: "CL",
        oraclePrice: tx.oraclePrice,
      } as Tx;
    });
    const closeShortTxs = result.closeShorts.items.map((tx) => {
      return {
        underlying: underlying,
        pool: `${underlying.symbol} / USDC`,
        poolAddress: tx.pool,
        power: power,
        dateTime: tx.blockTimestamp,
        size: BigInt(tx.redeemedAmount),
        hash: tx.transactionHash,
        action: "CS",
        oraclePrice: tx.oraclePrice,
      } as Tx;
    });

    const txs: Tx[] = [...closeLongTxs, ...closeShortTxs];

    txs.sort((a, b) => Number(b.dateTime) - Number(a.dateTime));
    return txs;
  }

  // **********************
  // *  Static Functions  *
  // **********************
  public async getPriceRefAdjusted(pool: string) {
    const poolAddr = pool as `0x${string}`;
    try {
      const val = await this.publicClient.readContract({
        abi: PotentiaPoolABI,
        address: poolAddr,
        functionName: "priceRefAdjusted",
      });

      return val as string;
    } catch (e) {
      throw new Error("error: " + e);
    }
  }

  public async get30DFeeCumulativeSum(pool: `0x${string}`, noOfDays?: number) {
    if (noOfDays === undefined) noOfDays = 30;

    const now = new Date().getTime();
    const timeInMilliSeconds = 1000 * 60 * 60 * 24 * noOfDays;
    const from = now - timeInMilliSeconds;

    const result = await this.ponderClient.getRawDailyData(pool, from, now);
    const rawFee = result.dailyInfos.items.map((i) => i.fee);

    let lastFee = 0n;
    const fees = result.dailyInfos.items.map((item) => {
      const fee = {
        fee: BigInt(item.fee) + lastFee,
        date: item.date,
      };
      lastFee = fee.fee;
      return fee;
    });

    return fees;
  }
}

export * from "./datafeed";
export * from "./ponderClient";
export * from "./poolWrite";
export * from "./interfaces";
export * from "./lib/datafeedTypes";
