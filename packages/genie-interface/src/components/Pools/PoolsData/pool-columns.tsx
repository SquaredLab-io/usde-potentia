/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Address } from "viem";
import { createChart, CrosshairMode, IChartApi, ISeriesApi } from "lightweight-charts";
import {
  _getDecimalAdjusted,
  formatLimit,
  formatNumber,
  formatOraclePrice,
  getDecimalAdjusted,
  getDollarQuote,
  shortenHash,
  toDollarUnits
} from "@lib/utils/formatting";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { PoolInfo, Tx } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { BASE_SEPOLIA } from "@lib/constants";
import { calculatePoolAge } from "@lib/utils/calculatePoolAge";
import PoolMenu from "./PoolMenu";
import { getActionType, getPoolTokens } from "@lib/utils/pools";
import { getFeesTimeseries } from "@components/PoolOverview/helper";
import { useMonthlyFundingFee } from "@lib/hooks/useMonthlyFundingFee";
import { useLpStore } from "@store/lpStore";
import { LpTradeOptions } from "@lib/types/enums";

const getCorrectLineColor = (val1: number | null, val2: number | null) => {
  switch (true) {
    case !!val1 && !!val2 && val1 > val2:
      return "#CF1800";
    case !!val1 && !!val2 && val1 < val2:
      return "#44BD22";
    default:
      return "#2962FF";
  }
};

export function allPoolsColumnDef(
  updateSelectedPool: (value: PoolInfo) => void
): ColumnDef<PoolInfo>[] {
  const { setLpTradeOption } = useLpStore();
  return [
    {
      id: "assets",
      accessorKey: "assets",
      header: () => (
        <div className="pl-[18px]">
          <span>Asset</span>
        </div>
      ),
      cell: ({ row }) => {
        const { power, pool } = row.original;
        const assets = getPoolTokens(pool);
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
                    alt={asset}
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
                  p = {power}
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
      id: "age",
      accessorKey: "age",
      header: () => <span className="pl-[18px]">Age</span>,
      cell: ({ row }) => {
        const { age } = row.original;
        return <span className="pl-[18px]">{calculatePoolAge(age)}</span>;
      }
    },
    {
      id: "tvl",
      accessorKey: "tvl",
      header: () => <span className="pl-[18px]">TVL</span>,
      cell: ({ row }) => {
        const { tvl, oraclePrice, underlying } = row.original;
        // tvl and oraclePrice comes in 18 decimals for all
        return <span className="pl-[18px]">{getDollarQuote(tvl, oraclePrice, 18)}</span>;
      }
    },
    {
      id: "volume",
      accessorKey: "volume",
      header: () => <span className="pl-[18px]">30D Volume</span>,
      cell: ({ row }) => {
        const { vol, oraclePrice, underlyingDecimals } = row.original;
        const growth = parseFloat("0");
        return (
          <div className="pl-[18px] inline-flex gap-1">
            <span>{getDollarQuote(vol, oraclePrice, underlyingDecimals)}</span>
            {/* <span
              className={cn(growth > 0 ? "text-positive-green" : "text-negative-red")}
            >
              {growth}%
            </span> */}
          </div>
        );
      }
    },
    {
      id: "fee",
      accessorKey: "fee",
      header: () => <span className="pl-10">30D Fees</span>,
      cell: ({ row }) => {
        const { fee, underlyingDecimals, oraclePrice } = row.original;
        const growth = parseFloat("0");
        return (
          <div className="pl-10 inline-flex gap-1">
            <span>{getDollarQuote(fee, oraclePrice, underlyingDecimals)}</span>
            {/* <span
              className={cn(growth > 0 ? "text-positive-green" : "text-negative-red")}
            >
              {growth}%
            </span> */}
          </div>
        );
      }
    },
    {
      id: "action",
      accessorKey: "action",
      header: () => <span className="opacity-0">Action</span>,
      cell: ({ row }) => {
        const pool = row.original;
        return (
          <div className="inline-flex items-center justify-end max-w-fit float-right mr-5 w-full gap-2">
            <Link
              href={{
                pathname: `/pool/${pool.underlying}`,
                query: { power: pool.power }
              }}
              as={`/pool/${pool.underlying}?power=${pool.power}`}
            >
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setLpTradeOption(LpTradeOptions.supply);
                }}
              >
                Add Liquidity
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  updateSelectedPool(pool);
                }}
              >
                Trade
              </Button>
            </Link>
          </div>
        );
      }
    }
  ];
}

export function userPoolsColumnDef(): ColumnDef<PoolInfo>[] {
  const { setLpTradeOption } = useLpStore();
  return [
    {
      accessorKey: "assets",
      header: () => (
        <div className="pl-[18px]">
          <span>Asset</span>
        </div>
      ),
      cell: ({ row }) => {
        const { pool, power } = row.original;
        const assets = getPoolTokens(pool);
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
                  p = {power}
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
      accessorKey: "historical_fees",
      header: () => <span>Historical Pool Fees</span>,
      cell: ({ row }) => {
        const { poolAddr } = row.original;

        const { cumulativeSumData, isFetching } = useMonthlyFundingFee(
          poolAddr as Address
        );

        const chartContainerRef = useRef(null);
        const chartRef = useRef<IChartApi | null>(null);
        const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);
        const [isLoadingChart, setIsLoadingChart] = useState(false);

        // Reversed as we need series in ascending order
        const timeseries = useMemo(
          () => getFeesTimeseries(cumulativeSumData),
          [cumulativeSumData]
        );

        const chartOptions = useMemo(
          () => ({
            width: 135,
            height: 45,
            layout: {
              background: {
                color: "transparent"
              },
              attributionLogo: false
            },
            grid: {
              vertLines: {
                visible: false
              },
              horzLines: {
                visible: false
              }
            },
            crosshair: {
              mode: CrosshairMode.Hidden
            },
            timeScale: {
              visible: false
            },
            rightPriceScale: {
              visible: false
            },
            handleScale: false,
            handleScroll: false
          }),
          []
        );

        const seriesOptions = useMemo(
          () => ({
            color:
              timeseries.length !== 0
                ? getCorrectLineColor(
                    timeseries[0].value,
                    timeseries[timeseries.length - 1].value
                  )
                : "#2962FF",
            lastValueVisible: false,
            priceLineVisible: false
          }),
          [timeseries]
        );

        useEffect(() => {
          if (!chartContainerRef.current) return;
          setIsLoadingChart(true);

          if (!chartRef.current) {
            chartRef.current = createChart(chartContainerRef.current, chartOptions);
            seriesRef.current = chartRef.current.addLineSeries(seriesOptions);
          } else {
            chartRef.current.applyOptions(chartOptions);
            seriesRef.current?.applyOptions(seriesOptions);
          }

          chartRef.current.timeScale().fitContent();
          seriesRef.current?.setData(timeseries);
          seriesRef.current?.priceScale().applyOptions({
            autoScale: false
          });

          setIsLoadingChart(false);

          return () => {
            if (chartRef.current) {
              chartRef.current.remove();
              chartRef.current = null;
              seriesRef.current = null;
            }
          };
        }, [chartOptions, seriesOptions, timeseries]);

        return (
          <div className="relative max-h-[150px] max-w-[200px]">
            {(isLoadingChart || isFetching) && (
              <span className="absolute inset-0 flex items-center justify-center z-10 bg-primary-gray bg-opacity-50">
                ...
              </span>
            )}
            <div className="h-full" ref={chartContainerRef} />
          </div>
        );
      }
    },
    {
      accessorKey: "fee",
      header: () => <span>30D Funding</span>,
      cell: ({ row }) => {
        const { oraclePrice, poolAddr } = row.original;
        const { fundingFeeData, isFetching: isFetchingFees } = useMonthlyFundingFee(
          poolAddr as Address
        );

        const feeLimit = formatLimit(
          (fundingFeeData
            ? fundingFeeData.feePerToken * formatOraclePrice(BigInt(oraclePrice))
            : 0
          ).toString(),
          0.0001
        );

        return isFetchingFees ? (
          <span>...</span>
        ) : fundingFeeData ? (
          <div className="inline-flex gap-1">
            <span>{toDollarUnits(feeLimit.value, 2)}</span>
            <span
              className={cn(
                fundingFeeData.feePercent > 0
                  ? "text-positive-green"
                  : fundingFeeData.feePercent < 0
                    ? "text-negative-red"
                    : undefined
              )}
            >
              {fundingFeeData.feePercent.toFixed(5)}%
            </span>
          </div>
        ) : (
          <span>NA</span>
        );
      }
    },
    {
      accessorKey: "action",
      header: () => <span className="sr-only">Action</span>,
      cell: ({ row }) => {
        const { underlying, power } = row.original;
        return (
          <div className="inline-flex justify-end gap-2 max-w-fit float-right mr-5">
            <Link
              href={{
                pathname: `/pool/${underlying}`,
                query: { power: power }
              }}
              as={`/pool/${underlying}?power=${power}`}
            >
              <Button
                size="lg"
                variant="default"
                onClick={() => {
                  setLpTradeOption(LpTradeOptions.supply);
                }}
              >
                Deposit
              </Button>
            </Link>
            <PoolMenu underlying={underlying} power={power}>
              <Button size="sm" variant="secondary">
                More
              </Button>
            </PoolMenu>
          </div>
        );
      }
    }
  ];
}

export function transactionsColumnDef(): ColumnDef<Tx>[] {
  return [
    {
      id: "assets",
      accessorKey: "assets",
      header: () => <span className="pl-[18px]">Asset</span>,
      cell: ({ row }) => {
        const { underlying, power } = row.original;
        const underlyingTokens = [underlying.symbol, "USDC"];
        return (
          <div className="whitespace-nowrap flex flex-row gap-2 text-left font-medium pl-[18px] py-6">
            <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-2">
              {underlyingTokens.map((asset) => (
                <div
                  key={asset}
                  className="z-0 flex overflow-hidden ring-1 ring-white rounded-full bg-neutral-800"
                >
                  <Image
                    src={`/tokens/${asset.toLowerCase()}.svg`}
                    alt={asset}
                    width={26}
                    height={26}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <div className="inline-flex gap-2">
                <p className="font-bold text-sm/5">
                  {underlyingTokens.map((asset, index) => (
                    <>
                      <span key={index}>{asset}</span>
                      {underlyingTokens.length !== index + 1 && (
                        <span className="text-[#9299AA] mx-1">/</span>
                      )}
                    </>
                  ))}
                </p>
                <p className="font-medium text-xs/3 bg-[#49AFE9] py-1 px-[10px] rounded-md">
                  p = {_getDecimalAdjusted(power.toString(), 18)}
                </p>
              </div>
              <div className="font-normal text-sm/5 text-[#9299AA]">
                <p>
                  {"Potentia V1"} • {"Base Sepolia"}
                </p>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: "txn",
      accessorKey: "hash",
      header: () => <span>Txn</span>,
      cell: ({ row }) => {
        const { hash, action } = row.original;
        return (
          <p className="flex flex-col items-start">
            <span className="font-bold">{getActionType(action)}</span>
            <span className="text-[#9299AA] text-sm/5">{shortenHash(hash)}</span>
          </p>
        );
      }
    },
    {
      id: "lp",
      accessorKey: "lp",
      header: () => <span>LP Amount</span>,
      cell: ({ row }) => {
        const { lp, underlying } = row.original;
        return <span>{formatNumber(getDecimalAdjusted(lp, 18))}</span>;
      }
    },
    {
      id: "underlying",
      accessorKey: "underlying",
      header: () => <span>Underlying</span>,
      cell: ({ row }) => {
        const { underlyingSize, underlying } = row.original;
        return (
          <span>
            {formatNumber(getDecimalAdjusted(underlyingSize, underlying.decimals))}{" "}
            {underlying.symbol}
          </span>
        );
      }
    },
    {
      id: "value",
      accessorKey: "value",
      header: () => <span>Value</span>,
      cell: ({ row }) => {
        const { underlyingSize, oraclePrice, underlying } = row.original;
        return (
          <div className="inline-flex gap-1">
            <span>
              {getDollarQuote(
                underlyingSize,
                oraclePrice.toString(),
                underlying.decimals
              )}
            </span>
          </div>
        );
      }
    }
  ];
}
