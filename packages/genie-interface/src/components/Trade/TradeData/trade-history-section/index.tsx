import { Tx } from "@squaredlab-io/sdk";
import Image from "next/image";
import { formatUnits } from "viem";
import { ColumnDef } from "@tanstack/react-table";
import { BASE_SEPOLIA } from "@lib/constants";
import TradeHistoryTable from "./trade-history-table";
import {
  formatLimit,
  formatNumber,
  formatOraclePrice,
  formatTimestamp,
  getDecimalAdjusted
} from "@lib/utils/formatting";
import { cn } from "@lib/utils";
import { usePoolsStore } from "@store/poolsStore";
import { useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import TradeHistoryCards from "./trade-history-cards";

const TradeHistorySection = ({
  closedPositions,
  isTradeLoading
}: {
  closedPositions: Tx[];
  isTradeLoading: boolean;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)"); // tailwind `md`
  const { poolMap } = usePoolsStore();

  const transactionsColumns: ColumnDef<Tx>[] = [
    {
      accessorKey: "pool",
      header: () => (
        <div className="pl-4">
          <span>Assets</span>
        </div>
      ),
      cell: ({ row }) => {
        const { power, pool } = row.original;
        const assets = pool.split(" / ").map((asset) => asset.trim());
        const _power = formatUnits(BigInt(power), 18);
        return (
          <div className="whitespace-nowrap flex flex-row gap-2 text-left font-medium pl-[18px] py-6">
            <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-2">
              {assets.map((asset) => (
                <div
                  key={asset}
                  className="z-0 flex overflow-hidden ring-1 ring-white rounded-full bg-neutral-800"
                >
                  <Image
                    src={`/tokens/${asset.toLowerCase()}.svg`}
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
                  {assets.map((asset, index) => (
                    <>
                      <span key={index}>{asset}</span>
                      {assets.length !== index + 1 && (
                        <span className="text-[#9299AA] mx-1">/</span>
                      )}
                    </>
                  ))}
                </p>
                <p className="font-medium text-xs/3 bg-[#49AFE9] py-1 px-[10px] rounded-md">
                  p = {_power}
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
      accessorKey: "action",
      header: () => <span className="ml-10">Side</span>,
      cell: ({ row }) => {
        const action = row.original.action === "CL" ? "Long" : "Short";
        return (
          <span
            className={cn(
              "w-full ml-10",
              action === "Long"
                ? "text-[#0AFC5C]"
                : action === "Short"
                  ? "text-[#FF3318]"
                  : ""
            )}
          >
            {action}
          </span>
        );
      }
    },
    {
      accessorKey: "size",
      header: () => <span>Size</span>,
      cell: ({ row }) => {
        const { action, oraclePrice, underlying, size, poolAddress } = row.original;
        const poolData = poolMap?.[poolAddress];

        const tokenSize = formatLimit(
          formatNumber(getDecimalAdjusted(size.toString(), poolData?.decimals)),
          0.001
        );
        const tokenPrice = formatOraclePrice(oraclePrice);
        if (action === "CL" || action === "CS")
          return (
            <p className="flex flex-col items-start">
              <span>
                {tokenSize.value} {underlying.symbol}
              </span>
              <span className="text-[#9299AA] text-xs">
                {formatNumber(tokenPrice * tokenSize.value, true)}
              </span>
            </p>
          );
        return <span>-</span>;
      }
    },
    {
      accessorKey: "time",
      header: () => <span>Time</span>,
      cell: ({ row }) => {
        const { date, time } = formatTimestamp(row.original.dateTime);
        return (
          <p className="flex flex-col items-start max-w-fit">
            <span>{date}</span>
            <span className="font-normal text-xs/4 text-[#9299AA]">{time}</span>
          </p>
        );
      }
    },
    {
      accessorKey: "pnl",
      header: () => <span>P&L</span>,
      cell: ({ row }) => {
        const isGrowth = false;
        return <span className={cn(isGrowth && "border text-[#07AE3B]")}>-</span>;
      }
    }
  ];

  return useMemo(() => {
    return isDesktop ? (
      <TradeHistoryTable
        columns={transactionsColumns}
        data={closedPositions}
        isLoading={isTradeLoading}
      />
    ) : (
      <TradeHistoryCards data={closedPositions} isLoading={isTradeLoading} />
    );
  }, [isDesktop, closedPositions, isTradeLoading]);
};

export default TradeHistorySection;
