import BigNumber from "bignumber.js";
import { PotentiaSdk } from "../";
import { PoolInfo } from "../interfaces/index.interface";
import {
  Bar,
  DatafeedConfiguration,
  IDatafeedChartApi,
  IExternalDatafeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  ResolutionString,
  SearchSymbolResultItem
} from "../lib/datafeedTypes";
import PonderClient from "../ponderClient";

export const ConfigurationData: DatafeedConfiguration = {
  supports_marks: true,
  currency_codes: ["USD", "EUR"],
  supports_timescale_marks: false,
  supports_time: true,
  exchanges: [{ value: "", name: "All Exchanges", desc: "" }],
  symbols_types: [{ name: "All types", value: "" }],
  supported_resolutions: ["5"] as ResolutionString[]
};

export class DatafeedHelper {
  sdk: PotentiaSdk;
  showCandleChart: boolean;

  constructor(sdk: PotentiaSdk, showCandleChart?: boolean) {
    this.sdk = sdk;
    this.showCandleChart = showCandleChart || false;
  }

  public precision(price: number): number {
    return Math.floor(Math.max(1, 5 - Math.log10(price)));
  }

  public async getPoolsSymbols(
    cachePools?: PoolInfo[]
  ): Promise<{ symbols: SearchSymbolResultItem[]; map: Map<string, number> }> {
    let symbols: SearchSymbolResultItem[] = [];
    const map = new Map<string, number>();

    let pools = cachePools;
    if (pools == undefined) {
      pools = await this.sdk.getPools();
    }

    for (const pool of pools) {
      // console.log(
      //   "price",
      //   BigNumber(pool.oraclePrice)
      //     .dividedBy(BigNumber(10).pow(BigNumber(18)))
      //     .toNumber()
      // );
      const longSymbol = `${pool.underlying}^${pool.power} LONG`;
      const shortSymbol = `${pool.underlying}^${pool.power} SHORT`;
      symbols.push(this.getSearchSymbolResultItem(pool, longSymbol));
      symbols.push(this.getSearchSymbolResultItem(pool, shortSymbol));
      map.set(
        longSymbol,
        this.precision(
          BigNumber(pool.oraclePrice)
            .dividedBy(BigNumber(10).pow(BigNumber(18)))
            .toNumber()
        )
      );
      map.set(
        shortSymbol,
        this.precision(
          BigNumber(pool.oraclePrice)
            .dividedBy(BigNumber(10).pow(BigNumber(18)))
            .toNumber()
        )
      );
    }

    return { symbols, map };
  }

  private getSearchSymbolResultItem(
    pool: PoolInfo,
    symbol: string
  ): SearchSymbolResultItem {
    const poolSymbol: SearchSymbolResultItem = {
      symbol: symbol,
      full_name: `${pool.underlying}^${pool.power}`,
      description: `Potentia pool for ${pool.underlying} with power of ${pool.power}`,
      exchange: "potentia protocol",
      ticker: symbol,
      type: "derivatives"
    };
    return poolSymbol;
  }

  public async getSymbolFromName(
    symbolName: string,
    cacheSymbols?: SearchSymbolResultItem[]
  ) {
    const res = await this.getPoolsSymbols();
    const symbols = res.symbols;
    const map = res.map;

    const symbol = symbols.find((s) => s.symbol === symbolName);
    if (!symbol) {
      throw new Error("Symbol not found");
    }
    return { symbol, map };
  }

  public async getPoolFromName(
    symbolName: string,
    cachePools?: PoolInfo[]
  ): Promise<{ pool: string; isLong: boolean }> {
    let pools = cachePools;

    if (pools == undefined) {
      pools = await this.sdk.getPools();
    }

    let isLong = false;
    const pool = pools.find((s) => {
      if (`${s.underlying}^${s.power} LONG` === symbolName) {
        isLong = true;
        return true;
      } else if (`${s.underlying}^${s.power} SHORT` === symbolName) {
        return true;
      }
    });

    if (!pool) {
      throw new Error("Symbol or pool not found");
    }

    return { pool: pool.poolAddr, isLong: isLong };
  }

  public async getSymbolResolvedInfo(
    symbolName: string,
    cacheSymbols?: SearchSymbolResultItem[]
  ): Promise<LibrarySymbolInfo> {
    const { symbol, map } = await this.getSymbolFromName(
      symbolName,
      cacheSymbols
    );
    const pricescale = map.get(symbol!.symbol)!;
    // console.log("price scale for ", symbol!.symbol, pricescale);
    return {
      name: symbol!.symbol,
      // timezone: "America/New_York",
      timezone: "America/New_York",
      minmov: 1,
      session: "24x7",
      has_intraday: true,
      visible_plots_set: this.showCandleChart ? "ohlc" : "c",
      // visible_plots_set: "c",
      description: symbol!.description,
      supported_resolutions: ConfigurationData.supported_resolutions,
      pricescale: 10 ** pricescale,
      type: "stock",
      ticker: symbol!.symbol,
      exchange: symbol!.exchange,
      has_daily: true,
      format: "price",
      listed_exchange: symbol!.exchange,
      data_status: "streaming"
    };
  }

  // public getLocalData(
  //   symbolName: string,
  //   from: number,
  //   to: number,
  //   isLong: boolean,
  //   resolution?: string
  // ): Bar[] {
  //   return PricesJSON.filter((p) => {
  //     if (p.timestamp >= from.toString() && p.timestamp <= to.toString()) {
  //       return true;
  //     }
  //     return false;
  //   }).map((p) => {
  //     const bar: Bar = {
  //       time: parseInt(p.timestamp) * 1000,
  //       open: parseFloat(isLong ? p.longPrice : p.shortPrice),
  //       high: parseFloat(isLong ? p.longPrice : p.shortPrice),
  //       low: parseFloat(isLong ? p.longPrice : p.shortPrice),
  //       close: parseFloat(isLong ? p.longPrice : p.shortPrice),
  //     };
  //     return bar;
  //   });
  // }

  // public async getSymbolBars(
  //   symbolName: string,
  //   from: number,
  //   to: number,
  //   resolution?: string,
  //   cachePools?: PoolInfo[]
  // ): Promise<Bar[]> {
  //   const { pool, isLong } = await this.getPoolFromName(symbolName, cachePools);
  //   const priceData = await this.sdk.subgraph.getLongShortPriceData(
  //     pool,
  //     from,
  //     to,
  //     resolution
  //   );
  //   const bars = priceData.map((price) => {
  //     const bar: Bar = {
  //       time: parseInt(price.timestamp) * 1000,
  //       open: parseFloat(isLong ? price.longPrice : price.shortPrice),
  //       high: parseFloat(isLong ? price.longPrice : price.shortPrice),
  //       low: parseFloat(isLong ? price.longPrice : price.shortPrice),
  //       close: parseFloat(isLong ? price.longPrice : price.shortPrice),
  //     };
  //     return bar;
  //   });

  //   return bars;
  // }

  public async getSymbolBarsFromPonder(
    symbolName: string,
    from: number,
    to: number,
    resolution?: string,
    cachePools?: PoolInfo[]
  ): Promise<{ bars: Bar[]; pool: string; isLong: boolean }> {
    const { pool, isLong } = await this.getPoolFromName(symbolName, cachePools);
    const priceData = await this.sdk.ponderClient.getMinBars(
      pool.toLowerCase(),
      from,
      to,
      isLong,
      resolution
    );

    const bars = priceData.map((price) => {
      const bar: Bar = {
        time: price.timestamp * 1000,
        open: price.open,
        high: price.high,
        low: price.low,
        close: price.close
      };
      return bar;
    });

    return {
      bars: bars,
      pool: pool.toLowerCase(),
      isLong: isLong
    };
  }
}
