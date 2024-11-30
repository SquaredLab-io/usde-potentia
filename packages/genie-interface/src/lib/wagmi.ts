import { WALLET_CONNECT_PROJECT_ID } from "@lib/keys";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { meta } from "./constants";
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rabbyWallet,
  rainbowWallet
} from "@rainbow-me/rainbowkit/wallets";

coinbaseWallet.preference = "smartWalletOnly";

export const config = getDefaultConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http("/api/baseRpc") // Proxy for Base RPC
  },
  wallets: [
    {
      groupName: "Suggested",
      wallets: [
        metaMaskWallet,
        rabbyWallet,
        walletConnectWallet,
        coinbaseWallet,
        rainbowWallet
      ]
    }
  ],
  ssr: false, // default
  cacheTime: 4_000, // default
  projectId: WALLET_CONNECT_PROJECT_ID,
  // APP INFO
  appName: meta.APP_NAME,
  appDescription: meta.DESCRIPTION,
  appUrl: meta.APP_URL,
  appIcon: meta.LOGO
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
