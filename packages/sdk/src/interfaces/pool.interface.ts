import BigNumber from "bignumber.js";

export interface TokenAddress {
  lp: string;
  long: string;
  short: string;
}

export interface TokenSupply {
  lpToken: {
    address: string;
    supply: string;
  };
  longToken: {
    address: string;
    supply: string;
  };
  shortToken: {
    address: string;
    supply: string;
  };
}

export interface TokenBalance {
  lpToken: {
    address: string;
    balance: string;
  };
  longToken: {
    address: string;
    balance: string;
  };
  shortToken: {
    address: string;
    balance: string;
  };
}

export interface TokenUnitPrice {
  long: {
    address: string;
    price: BigNumber;
    payoff: BigNumber;
    supply: string;
  };
  short: {
    address: string;
    price: BigNumber;
    payoff: BigNumber;
    supply: string;
  };
}
