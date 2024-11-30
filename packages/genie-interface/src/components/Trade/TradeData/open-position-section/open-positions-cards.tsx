import Image from "next/image";
import { useAccount } from "wagmi";
import { OpenPositionInfo } from "@squaredlab-io/sdk";
import NextImage from "@components/common/NextImage";
import { BASE_SEPOLIA } from "@lib/constants";
import { useTokenPrice } from "@lib/hooks/useTokenPrice";
import { cn } from "@lib/utils";
import { formatLimit, formatNumber, getDecimalAdjusted } from "@lib/utils/formatting";
import { usePoolsStore } from "@store/poolsStore";
import ClosePositionDrawer from "./close-position-drawer";
import { useState } from "react";

interface PropsType {
  data: OpenPositionInfo[];
  isLoading: boolean;
}

const PositionCard = ({ data }: { data: OpenPositionInfo }) => {
  const [isClosePosOpen, setIsClosePosOpen] = useState(false);
  const { poolMap } = usePoolsStore();

  const { pool, side, tokenSize, underlyingPrice, PAndLAmtInDollars, PAndLPercent } =
    data;
  const poolData = poolMap?.[pool];
  const assets = [poolData?.underlying, "USDC"];

  // Size
  const { tokenPrices, isFetching } = useTokenPrice({
    poolAddress: pool
  });
  const tradePrice = tokenPrices
    ? parseFloat(side === "Long" ? tokenPrices.lastLongP : tokenPrices.lastShortP)
    : undefined;

  const size = formatLimit(
    getDecimalAdjusted(tokenSize, poolData?.decimals).toString(),
    0.01
  );
  const sizeInDollars = formatLimit(
    (
      parseFloat(underlyingPrice) *
      (tradePrice ?? 0) *
      getDecimalAdjusted(tokenSize, poolData?.decimals)
    ).toString(),
    0.001
  );

  // P&L
  const pAndLAmt = formatLimit(PAndLAmtInDollars, 0.01);
  const pAndLPercent = formatLimit(PAndLPercent, 0.01);

  const isLong = data.side === "Long";

  return (
    <div className="p-3 flex flex-col gap-5 border border-secondary-gray rounded-lg">
      {/* Title */}
      <div className="flex flex-row gap-2 text-left font-medium">
        <div className="flex flex-row items-center max-w-fit -space-x-2">
          {assets?.map((asset) => (
            <div
              key={asset}
              className="z-0 flex overflow-hidden ring-1 ring-white rounded-full bg-neutral-800"
            >
              <Image
                src={`/tokens/${asset?.toLowerCase()}.svg`}
                alt={`${asset} icon`}
                width={26}
                height={26}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 text-left">
          <div className="inline-flex gap-2">
            <p className="font-bold text-sm/5">
              {assets?.map((asset, index) => (
                <span key={asset}>
                  {asset}
                  {assets.length !== index + 1 && (
                    <span className="text-[#9299AA] mx-1">/</span>
                  )}
                </span>
              ))}
            </p>
            <p className="text-nowrap font-normal text-xs/[14px] bg-gradient-cyan py-[2px] px-1 rounded-sm opacity-90">
              p = {poolData?.power}
            </p>
          </div>
          <div className="font-normal text-sm/5 text-[#9299AA]">
            <p>
              {BASE_SEPOLIA.PROTOCOL} • {BASE_SEPOLIA.NAME}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        {/* Position type */}
        <div className="flex flex-col items-start gap-4">
          <h4 className="font-bold text-sm/[18px] text-[#5F7183]">Side</h4>
          <span
            className={cn(
              "font-normal text-sm/4",
              side === "Long"
                ? "text-[#0AFC5C]"
                : side === "Short"
                  ? "text-[#FF3318]"
                  : ""
            )}
          >
            {side as string}
          </span>
        </div>
        {/* Token Size */}
        <div className="flex flex-col items-start gap-2">
          <h4 className="font-bold text-sm/[18px] text-[#5F7183]">Size</h4>
          <p className="flex flex-col items-start gap-[2px]">
            <span className="font-normal text-sm/4">{formatNumber(size.value)}</span>
            <span className="text-[#9299AA] font-normal text-xs/4">
              {isFetching && !sizeInDollars
                ? "..."
                : formatNumber(sizeInDollars.value, true)}
            </span>
          </p>
        </div>
        {/* PNL */}
        <div className="flex flex-col items-start gap-2">
          <h4 className="font-bold text-sm/[18px] text-[#5F7183]">P&L</h4>
          <p className="flex flex-col gap-[2px] items-start">
            <span
              className={cn(
                "font-normal text-sm/4",
                pAndLPercent.value == 0
                  ? "text-gray-200"
                  : pAndLPercent.value > 0
                    ? "text-[#0AFC5C]"
                    : "text-[#FF3318]"
              )}
            >
              {formatNumber(pAndLAmt.value, true)}
            </span>
            <span
              className={cn(
                "font-normal text-xs/4",
                pAndLPercent.sign ? "text-[#07AE3B]" : "text-[#F23645]"
              )}
            >
              {formatNumber(pAndLPercent.value)}%
            </span>
          </p>
        </div>
      </div>
      <ClosePositionButton
        onClickFn={() => {
          setIsClosePosOpen(true);
        }}
      />
      {isClosePosOpen && (
        <ClosePositionDrawer
          open={isClosePosOpen}
          onOpenChange={setIsClosePosOpen}
          position={data}
          isLong={isLong}
        />
      )}
    </div>
  );
};

const ClosePositionButton = ({ onClickFn }: { onClickFn?: () => void }) => {
  return (
    <button
      onClick={onClickFn}
      className={cn(
        "w-full py-2 uppercase text-[#CF1800] bg-[#39150F] active:bg-[#64251B] font-sans-ibm-plex font-medium text-sm/6 transition-colors rounded",
        "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
      )}
    >
      Close Position
    </button>
  );
};

const OpenPositionsCards = ({ data, isLoading }: PropsType) => {
  const { isConnected } = useAccount();
  // const [isClosePosOpen, setIsClosePosOpen] = useState(false);

  if (!isConnected) {
    return (
      <div className="min-h-full w-full p-3 text-center">
        <span className="font-normal text-base/7 text-[#B5B5B5]">
          Connect Wallet to view your transactions.
        </span>
      </div>
    );
  } else if (data.length === 0)
    return (
      <div className="w-full p-3 flex flex-col gap-2 text-center">
        <NextImage
          src="/icons/file-icon.svg"
          className="size-[62px]"
          altText="file icon"
        />
        <span className="text-[#B0B3B8] font-normal text-sm/6">
          {isLoading ? "Fetching your Positions..." : "No Close Positions."}
        </span>
      </div>
    );

  return (
    <div className={cn("w-full flex flex-col gap-y-4 p-3")}>
      {data.map((position) => (
        <PositionCard key={`${position.pool}_${position.side}`} data={position} />
      ))}
    </div>
  );
};

export default OpenPositionsCards;
