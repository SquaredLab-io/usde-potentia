"use client";

import { PropsWithChildren } from "react";
import { UrqlProvider } from "@urql/next";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { WagmiProvider } from "wagmi";
import { config } from "@lib/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "viem/chains";
import { theme } from "../ConnectWallet/theme";
import { getQueryClient } from "@lib/utils/query/get-query-client";
import getUrqlClient from "@lib/utils/urql/get-urql-client";
import "@rainbow-me/rainbowkit/styles.css";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const [client, ssr] = getUrqlClient();
  const queryClient = getQueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={baseSepolia} modalSize="compact" theme={theme}>
          <UrqlProvider client={client} ssr={ssr}>
            {children}
          </UrqlProvider>
        </RainbowKitProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} position="bottom" /> */}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
