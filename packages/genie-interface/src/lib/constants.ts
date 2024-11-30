import { getAddress } from "viem";

//
// App's Metadata all at one place
//
export const meta = {
  APP_NAME: "Genie DEX",
  DESCRIPTION:
    "Genie DEX is a derivatives protocol without long and short liquidations. Built on top of Potentia Protocol.",
  KEYWORDS: [
    "Derivatives",
    "Liquidation",
    "Trading",
    "Perpetuals",
    "DeFi",
    "Power Perpetuals",
    "Leveraged Trading"
  ],
  APP_URL: "https://trade.geniedex.io/",
  DOMAIN: "https://geniedex.io/",
  IMAGE: "https://frontend-web-resources.s3.amazonaws.com/genie-og-large.png",
  SITE_NAME: "trade.geniedex.io",
  USERNAME: "@GenieDEX",
  TWITTER: "https://x.com/GenieDEX",
  DISCORD: "https://discord.com/invite/aD8Wtk4fNs",
  TELEGRAM: "https://t.me/genie_dex",
  DOCS: "https://docs.squaredlabs.io/",
  LOGO: "/images/logo.svg",
  SUPPORT_MAIL: "genie@squaredlabs.io"
};

// Header navigation links
export const navigation: {
  name: string;
  href: string;
  target: string;
}[] = [
  { name: "Trade", href: "/", target: "" },
  { name: "Pools", href: "/pools", target: "" }
];

export const SUPPORTED_NETWORKS = [
  {
    NAME: "Base Sepolia",
    PROTOCOL: "Potentia V1",
    LOGO: "/images/base_logo.svg"
  }
];
export const BASE_SEPOLIA = SUPPORTED_NETWORKS[0];

// Number of Blocks required for confirmation
export const CONFIRMATION = 7;

// Interval for refetching data in milliseconds
export const REFETCH_INTERVAL = 60 * 1000;

export const TOKENS: {
  [key: string]: `0x${string}`;
} = {
  WETH: getAddress("0x08EF999e4383FE62660022b73D145201bD5023d4"),
  ETH: getAddress("0x0000000000000000000000000000000000000000"),
  USDT: getAddress("0x32383fcE66D9D9311EF2bABc284a30a7112c27BF"),
  BTC: getAddress("0xc80f6CbE6271cc601b858c1521483E50AE19b36e")
};

interface Token {
  token: string;
  name: string;
  address: `0x${string}`;
  logo: string;
  decimals: number;
}

export const SUPPORTED_TOKENS: Token[] = [
  {
    token: "WETH",
    name: "Wrapped Ether",
    address: TOKENS.WETH,
    logo: "/tokens/weth.svg",
    decimals: 18
  },
  {
    token: "ETH",
    name: "Ether",
    address: TOKENS.ETH,
    logo: "/tokens/eth.svg",
    decimals: 18
  },
  {
    token: "USDT",
    name: "Tether USD",
    address: TOKENS.USDT,
    logo: "/tokens/usdt.svg",
    decimals: 6
  },
  {
    token: "BTC",
    name: "Bitcoin",
    address: TOKENS.BTC,
    logo: "/tokens/btc.svg",
    decimals: 18
  }
];
