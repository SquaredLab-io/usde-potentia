/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { _getDecimalAdjusted, formatNumber } from "@lib/utils/formatting";
import { cn } from "@lib/utils";
import { getPoolTokens } from "@lib/utils/pools";
import { ConstructedPoolsDataResponse } from "@lib/hooks/useFilteredPoolOverview";

export function poolsColumnDef(): ColumnDef<ConstructedPoolsDataResponse>[] {
  return [
    {
      id: "pools",
      accessorKey: "pools",
      header: () => (
        <div className="pl-6 text-left">
          <span>Pools</span>
        </div>
      ),
      cell: ({ row }) => {
        const { power, pool } = row.original;
        const assets = useMemo(() => getPoolTokens(pool), [pool]);
        return (
          <div className="whitespace-nowrap flex flex-row gap-1 text-left font-sans-ibm-plex font-medium pl-6 py-2">
            <div className="flex flex-row items-center max-w-fit -space-x-2">
              {assets.map((asset) => (
                <div
                  key={asset}
                  className="z-0 flex overflow-hidden rounded-full bg-secondary-gray"
                >
                  <Image
                    src={`/tokens/${asset.toLowerCase()}.svg`}
                    alt={asset}
                    width={24}
                    height={24}
                  />
                </div>
              ))}
            </div>
            <div className="inline-flex items-center gap-2">
              <p className="font-normal text-xs/4">
                {assets.map((asset, index) => (
                  <>
                    <span key={index}>{asset}</span>
                    {assets.length !== index + 1 && <span>-</span>}
                  </>
                ))}
              </p>
              <p className="text-nowrap font-normal text-xs/[14px] rounded-sm py-[2px] px-1 opacity-90 bg-gradient-cyan">
                p = {power}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      id: "price",
      accessorKey: "price",
      header: () => <span className="pr-[18px] text-right pb-2">Price</span>,
      cell: ({ row }) => {
        const { current_price } = row.original;
        return (
          <span className="pr-[18px] block py-2 font-normal text-xs/4">
            {formatNumber(current_price, true)}
          </span>
        );
      }
    },
    {
      id: "24hrChange",
      accessorKey: "24hrChange",
      header: () => <span className="pr-[18px] pt-6 pb-2">24h Change</span>,
      cell: ({ row }) => {
        const { price_change_percentage_24h } = row.original;
        return (
          <div className="block py-2 h-full">
            <span
              className={cn(
                "my-6 mr-[18px] rounded py-[4.5px] px-3 font-normal text-xs/4",
                price_change_percentage_24h > 0
                  ? "text-positive-green bg-positive-green/5"
                  : "text-negative-red bg-negative-red/10"
              )}
            >
              {`${price_change_percentage_24h > 0 ? "+" : ""}${price_change_percentage_24h.toPrecision(4)}%`}
            </span>
          </div>
        );
      }
    },
    {
      id: "24hrVol",
      accessorKey: "24hrVol",
      header: () => <span className="pr-6 pt-6 pb-2">24h Volume</span>,
      cell: ({ row }) => {
        const { total_volume } = row.original;
        return (
          <div className="pr-6 gap-1 block py-2 font-normal text-xs/4">
            <span>{formatNumber(total_volume, true)}</span>
            {/* <span
              className={cn(growth > 0 ? "text-positive-green" : "text-negative-red")}
            >
            </span> */}
          </div>
        );
      }
    }
  ];
}

export function poolsMobileColumnDef(): ColumnDef<ConstructedPoolsDataResponse>[] {
  return [
    {
      id: "pools",
      accessorKey: "pools",
      header: () => (
        <div className="pl-4 text-left">
          <span>Pools</span>
        </div>
      ),
      cell: ({ row }) => {
        const { power, pool } = row.original;
        const assets = useMemo(() => getPoolTokens(pool), [pool]);
        return (
          <div className="whitespace-nowrap flex flex-row gap-1 text-left font-sans-ibm-plex font-medium pl-4 py-0">
            <div className="flex flex-row items-center max-w-fit -space-x-2">
              {assets.map((asset) => (
                <div
                  key={asset}
                  className="z-0 flex overflow-hidden rounded-full bg-secondary-gray"
                >
                  <Image
                    src={`/tokens/${asset.toLowerCase()}.svg`}
                    alt={asset}
                    width={24}
                    height={24}
                  />
                </div>
              ))}
            </div>
            <div className="inline-flex items-center gap-2">
              <p className="font-normal text-xs/4">
                {assets.map((asset, index) => (
                  <>
                    <span key={index}>{asset}</span>
                    {assets.length !== index + 1 && <span>-</span>}
                  </>
                ))}
              </p>
              <p className="text-nowrap font-normal text-xs/[14px] rounded-sm py-[2px] px-1 opacity-90 bg-gradient-cyan">
                p = {power}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      id: "price",
      accessorKey: "price",
      header: () => <span className="text-right pb-2 pr-3">Price (24H)</span>,
      cell: ({ row }) => {
        const { current_price, price_change_percentage_24h } = row.original;
        const isPositive = price_change_percentage_24h > 0;
        return (
          <div className="flex flex-row items-center justify-end gap-2 py-2 pr-2 font-normal text-xs/4">
            <span>{formatNumber(current_price, true)}</span>
            <div className="block h-full py-1 px-[6px] rounded">
              <span
                className={cn(
                  "rounded py-1 px-[6px] font-normal text-xs/4",
                  isPositive
                    ? "text-positive-green bg-positive-green/5"
                    : "text-negative-red bg-negative-red/10"
                )}
              >
                {`${price_change_percentage_24h > 0 ? "+" : ""}${price_change_percentage_24h.toPrecision(2)}%`}
              </span>
            </div>
          </div>
        );
      }
    }
  ];
}
