/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { useMediaQuery } from "usehooks-ts";
import { OpenPositionInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import {
  _getDecimalAdjusted,
  formatLimit,
  formatNumber,
  getDecimalAdjusted
} from "@lib/utils/formatting";
import { cn } from "@lib/utils";
import { BASE_SEPOLIA } from "@lib/constants";
import { usePoolsStore } from "@store/poolsStore";
import { useTokenPrice } from "@lib/hooks/useTokenPrice";
import ClosePositionPopover from "./close-position-popover";
import OpenPositionsTable from "./open-positions-table";
import OpenPositionsCards from "./open-positions-cards";

const OpenPositionSection = ({
  openPositions,
  loadingOpenOrders
}: {
  openPositions: OpenPositionInfo[];
  loadingOpenOrders: boolean;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)"); // tailwind `md`
  const { poolMap } = usePoolsStore();

  const positionColumns: ColumnDef<OpenPositionInfo>[] = [
    {
      accessorKey: "pool",
      header: () => (
        <div className="pl-4">
          <span>Assets</span>
        </div>
      ),
      cell: ({ row }) => {
        const { pool } = row.original;
        const poolData = poolMap?.[pool];
        const assets = [poolData?.underlying, "USDC"];

        return (
          <div className="whitespace-nowrap flex flex-row gap-2 text-left font-medium pl-[18px] py-6">
            <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-2">
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
                    <>
                      <span key={index}>{asset}</span>
                      {assets.length !== index + 1 && (
                        <span className="text-[#9299AA] mx-1">/</span>
                      )}
                    </>
                  ))}
                </p>
                <p className="text-nowrap font-normal text-xs/[14px] bg-gradient-cyan py-1 px-2 rounded-[3px] opacity-90">
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
        );
      }
    },
    {
      accessorKey: "side",
      header: () => <span className="ml-10">Side</span>,
      cell: ({ row }) => {
        const side = row.original.side;
        return (
          <span
            className={cn(
              "w-full ml-10",
              side === "Long"
                ? "text-[#0AFC5C]"
                : side === "Short"
                  ? "text-[#FF3318]"
                  : ""
            )}
          >
            {side as string}
          </span>
        );
      }
    },
    {
      accessorKey: "tokenSize",
      header: () => <span>Size</span>,
      cell: ({ row }) => {
        const { tokenSize, underlyingPrice, side, pool } = row.original;
        const poolData = poolMap?.[pool];

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

        return (
          <p className="flex flex-col items-start">
            <span>{formatNumber(size.value)}</span>
            <span className="text-[#9299AA] text-xs">
              {isFetching && !sizeInDollars
                ? "..."
                : formatNumber(sizeInDollars.value, true)}
            </span>
          </p>
        );
      }
    },
    {
      accessorKey: "PAndLAmtInDollars",
      header: () => <span>P&L</span>,
      cell: ({ row }) => {
        const pAndLAmt = formatLimit(row.original.PAndLAmtInDollars, 0.01);
        const pAndLPercent = formatLimit(row.original.PAndLPercent, 0.01);
        return (
          <p className="flex flex-col gap-1 items-start">
            <span
              className={cn(
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
        );
      }
    },
    {
      accessorKey: "profit",
      header: () => <span className="sr-only">Action</span>,
      cell: ({ row }) => {
        const side = row.original.side;
        const isLong = side === "Long";

        // Use useMemo to prevent unnecessary re-renders of ClosePositionPopover
        return useMemo(
          () => (
            <ClosePositionPopover position={row.original} isLong={isLong}>
              <button className="py-1 px-[22px] text-white bg-[#32120D] font-normal text-[14px]/5 rounded-sm">
                Close
              </button>
            </ClosePositionPopover>
          ),
          [isLong]
        );
      }
    }
  ];

  // Based on the screen view it renders the required view for Open positions
  return useMemo(() => {
    return isDesktop ? (
      <OpenPositionsTable
        columns={positionColumns}
        data={openPositions}
        isLoading={loadingOpenOrders}
      />
    ) : (
      <OpenPositionsCards data={openPositions} isLoading={loadingOpenOrders} />
    );
  }, [isDesktop, openPositions, loadingOpenOrders]);
};

export default OpenPositionSection;
