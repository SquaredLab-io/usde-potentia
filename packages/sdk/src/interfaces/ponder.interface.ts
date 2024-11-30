export interface HourBar {
  timestamp: number;
  average: number;
  close: number;
  count: number;
  pool: string;
  open: number;
  low: number;
  high: number;
  id: string;
}

export interface MinBar {
  timestamp: number;
  average: number;
  close: number;
  count: number;
  pool: string;
  open: number;
  low: number;
  high: number;
  id: string;
}

export interface UserCurrentLongPosition {
  pool: string;
  user: string;
  staked: string;
  counterLongAmt: string;
}

export interface UserCurrentShortPosition {
  pool: string;
  user: string;
  staked: string;
  counterShortAmt: string;
}

export interface OpenCurrentLong {
  pool: string;
  user: string;
  staked: string;
  counterLongAmt: string;
}

export interface OpenCurrentShort {
  pool: string;
  user: string;
  staked: string;
  counterShortAmt: string;
}

export interface UserCurrentLpPosition {
  pool: string;
  user: string;
  staked: string;
  counterLpAmt: string;
  lpTokenPriceUnderlying: string;
  oraclePrice: string;
}

export interface CurrentLongPosition {
  userCurrentLongPos: UserCurrentLongPosition;
}

export interface CurrentShortPosition {
  userCurrentShortPos: UserCurrentShortPosition;
}

export interface CurrentUserPosition {
  userCurrentLongPos: UserCurrentLongPosition;
  userCurrentShortPos: UserCurrentShortPosition;
}

export interface Item {
  items: any[];
}

export interface TxHistory {
  openLongs: { items: any[] };
  openShorts: { items: any[] };
  closeLongs: { items: any[] };
  closeShorts: { items: any[] };
}

export interface UserTxHistory {
  addLiquiditys: { items: any[] };
  openLongs: { items: any[] };
  openShorts: { items: any[] };
  removeLiquiditys: { items: any[] };
  closeLongs: { items: any[] };
  closeShorts: { items: any[] };
}

export interface PoolStatusCurrent {
  id: string;
  x: bigint;
  phi: bigint;
  psi: bigint;
  alpha: bigint;
  beta: bigint;
  k: bigint;
  reserve: bigint;
  longTokenAddress: string;
  shortTokenAddress: string;
  longTokenSupply: string;
  shortTokenSupply: string;
  longTokenPrice: string;
  shortTokenPrice: string;
  oraclePrice: string;
  lpTokenSupply: string;
}

export interface PoolCreated {
  id: string;
  poolAddr: string;
  underlyingAddress: string;
  underlyingSymbol: string;
  underlyingDecimals: bigint;
  power: bigint;
  poolOp: string;
  blockNumber: bigint;
  blockTimestamp: bigint;
  transactionHash: string;
  oraclePrice: bigint;
}

export interface MonthlyInfo {
  id: string;
  date: bigint;
  pool: string;
  volume: bigint;
  fee: bigint;
}

export interface DailyInfo {
  id: string;
  date: bigint;
  pool: string;
  volume: bigint;
  lastTvl: bigint;
  maxTvl: bigint;
  minTvl: bigint;
  lastLongPrice: string;
  lastShortPrice: string;
  fee: bigint;
}

export interface FundingState {
  id: string;
  pool: string;
  x: bigint;
  phi: bigint;
  psi: bigint;
  liquidity: bigint;
  newPhi: bigint;
  newPsi: bigint;
  newLiquidity: bigint;
  dt: bigint;
  h: bigint;
}

export interface OraclePrice {
  oraclePrice: bigint;
}

export interface Power {
  power: bigint;
}

export interface PoolStatus {
  poolStateCurrents: { items: PoolStatusCurrent[] };
}

export interface PoolInfoArray {
  poolCreateds: { items: PoolCreated[] };
}

export interface MonthlyInfoArray {
  monthlyInfos: { items: MonthlyInfo[] };
}

export interface DailyInfoArray {
  dailyInfos: { items: DailyInfo[] };
}

export interface FundingStateArray {
  fundingStates: { items: FundingState[] };
}

export interface PowerArray {
  poolCreateds: { items: Power[] };
}

export interface OraclePriceArray {
  poolStateCurrents: { items: OraclePrice[] };
}

export interface PoolCreationHistoryArray {
  poolCreateds: { items: PoolCreated[] };
}

export interface CurrentLpPosition {
  userCurrentLpPoss: { items: UserCurrentLpPosition[] };
}

export interface CurrentUserPositionAllPools {
  userCurrentShortPoss: { items: OpenCurrentShort[] };
  userCurrentLongPoss: { items: OpenCurrentLong[] };
}

export interface UserPoint {
  id: string;
  points: number;
  volume: string;
  profit: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface UserPointsPagination {
  userPoints: { items: UserPoint[]; pageInfo: PageInfo };
}

export interface UserCloseHistory {
  id: string;
  user: string;
  tradeSize: string;
  timestamp: number;
}

export interface UserCloseHistoryPagination {
  userCloseHistorys: { items: UserCloseHistory[]; pageInfo: PageInfo };
}

export interface UserPoints {
  userPoints: { items: UserPoint[] };
}

export interface UserPointHistory {
  id: string;
  action: string;
  profit: string;
  points: number;
  user: string;
  timestamp: number;
}

export interface UserPtHistory {
  userPointHistorys: { items: UserPointHistory[]; pageInfo: PageInfo };
}

export interface UserPointRank {
  id: string;
  points: number;
  volume: string;
  profit: string;
  rank: number;
}

export interface RewardHistoryReturnType {
  rewardHistory: UserPointHistory[];
  max: number;
  min: number;
}
