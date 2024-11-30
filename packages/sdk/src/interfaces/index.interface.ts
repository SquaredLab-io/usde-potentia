import { ERC20 } from "reverse-mirage";
import BigNumber from "bignumber.js";

export interface Tx {
  underlying: ERC20;
  pool: string;
  poolAddress: string;
  power: number;
  dateTime: string;
  size: bigint;
  hash: string;
  oraclePrice: bigint;
  lp: string;
  underlyingSize: string;
  action: "AL" | "RL" | "OL" | "CL" | "OS" | "CS" | "PC";
}

export interface PoolInfo {
  tvl: string;
  age: string;
  vol: string;
  fee: string;
  lastMonthTimestamp: string;
  poolAddr: string;
  underlying: string;
  underlyingAddress: string;
  pool: string;
  power: number;
  underlyingDecimals: number;
  poolOp: string;
  oraclePrice: string;
}

export interface SinglePosVal {
  longTokenPos: {
    longTokenAddress: string;
    longTokenPosVal: BigNumber;
    longTokenBalance: string;
  };
  shortTokenPos: {
    shortTokenAddress: string;
    shortTokenPosVal: BigNumber;
    shortTokenBalance: string;
  };
}

export interface TokenInfo {
  longTokenInfo: {
    longPayoff: string;
    longSupply: string;
  };
  shortTokenInfo: {
    shortPayoff: string;
    shortSupply: string;
  };
}

export interface PositionValue {
  singlePosVal: SinglePosVal;
  tokenInfo: TokenInfo;
}

export interface OpenPositionInfo {
  pool: string;
  underlyingPrice: string;
  underlyingSize: string;
  tokenSize: string;
  positionValueInUnderlying: string;
  side: string;
  profit: boolean;
  PAndLPercent: string;
  PAndLAmtInDollars: string;
}

export interface PositionTab {
  longPositionTab?: OpenPositionInfo;
  shortPositionTab?: OpenPositionInfo;
}

export interface AllPositions {
  longPositions: OpenPositionInfo[];
  shortPositions: OpenPositionInfo[];
}

export interface DataPointInfo {
  lastLongP: string;
  longDailyChange: string;
  lastShortP: string;
  shortDailyChange: string;
  fundingInfo: FundingInfo;
  volume: string;
  dollarVol: string;
  tvl: string;
}

export interface FundingInfo {
  longF: BigNumber;
  shortF: BigNumber;
  liquidityF: BigNumber;
}
