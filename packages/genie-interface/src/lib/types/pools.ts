export interface MyPoolInfo {
  amount: string;
  id: string;
  pool: string;
  user: string;
}

export interface MyPools {
  user: string;
  pools: MyPoolInfo[];
}
