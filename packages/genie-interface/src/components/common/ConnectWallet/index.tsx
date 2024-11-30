"use client";

import { _getDecimalAdjusted, getDecimalAdjusted } from "@lib/utils/formatting";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useAccount, useBalance } from "wagmi";
import ConnectedButton from "./connected-button";

const ConnectWallet = ({ isBalance = true }: { isBalance?: boolean }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)"); // tailwind `md`
  const { address, isConnected } = useAccount();
  const { data, isLoading, isSuccess } = useBalance({
    address
  });

  const NativeBalance = () =>
    useMemo(
      () => (
        <div className="inline-flex items-center gap-x-2">
          <Image
            src="/tokens/eth.svg"
            alt="ETH balance"
            width={24}
            height={24}
            priority
          />
          <span>
            {isLoading
              ? "..."
              : isSuccess
                ? getDecimalAdjusted(data.value.toString(), data.decimals).toFixed(4)
                : "0"}
          </span>
        </div>
      ),
      [data, isLoading, isSuccess]
    );

  if (!isDesktop) return <ConnectedButton />;

  return (
    <>
      {isConnected && isBalance && <NativeBalance />}
      <ConnectButton label="Connect Wallet" showBalance={false} />
    </>
  );
};

export default ConnectWallet;
