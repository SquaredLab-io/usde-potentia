// API KEYS
export const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID ?? "";
if (!WALLET_CONNECT_PROJECT_ID) {
  console.warn("You need to provide a NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable");
}
export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY as string;
export const CRYPRO_COMPARE_API = process.env.NEXT_PUBLIC_CRYPRO_COMPARE_API as string;
export const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_KEY as string;

// URLS
export const SQL_CHANNEL_URL = process.env.NEXT_PUBLIC_SQL_CHANNEL as string;
export const PONDER_URL = process.env.NEXT_PUBLIC_PONDER as string;
export const BASE_SEPOLIA_RPC = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC as string;

// APP
export const NODE_ENV = process.env.NODE_ENV;
export const isProduction = process.env.NEXT_PUBLIC_ENV === "production";
export const isStaging = process.env.NEXT_PUBLIC_ENV === "staging";