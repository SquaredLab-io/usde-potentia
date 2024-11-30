import { PotentiaSdk } from "..";
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
import { DatafeedHelper } from "./datafeedHelper";
import { SqlWS } from "./ws";

export interface ExternalFeed extends IDatafeedChartApi {
  onReady(callback: OnReadyCallback): void;
}

export async function getPotentiaDataFeed(
  sdk: PotentiaSdk,
  config: DatafeedConfiguration,
  showCandleChart?: boolean
): Promise<ExternalFeed> {
  const helper = new DatafeedHelper(sdk, showCandleChart);
  const ws = new SqlWS(sdk.sqlChannelUrl);

  const cacheGetPools = await sdk.getPools();
  const cachePoolSymbols = await helper.getPoolsSymbols(cacheGetPools);

  const PotentiaDatafeed: ExternalFeed = {
    onReady: (callback) => {
      console.log("[onReady]: Method call");
      setTimeout(() => callback(config));
    },

    searchSymbols: async (
      userInput,
      exchange,
      symbolType,
      onResultReadyCallback
    ) => {
      console.log("[searchSymbols]: Method call");
      const poolsSymbols = cachePoolSymbols;
      // console.log("sumbols: ", poolsSymbols);
      onResultReadyCallback(poolsSymbols.symbols);
    },

    resolveSymbol(
      symbolName,
      onSymbolResolvedCallback,
      onResolveErrorCallback,
      extension
    ) {
      // console.log("symbol: ", symbolName);
      setTimeout(async () => {
        try {
          const resolvedInfo = await helper.getSymbolResolvedInfo(symbolName);
          onSymbolResolvedCallback(resolvedInfo);
        } catch (error) {
          onResolveErrorCallback("unknown_symbol");
        }
      }, 10);
    },

    async getBars(
      symbolInfo,
      resolution,
      periodParams,
      onHistoryCallback,
      onErrorCallback
    ) {
      setTimeout(async () => {
        try {
          //   const bars = helper.getLocalData(
          //     symbolInfo.name,
          //     periodParams.from,
          //     periodParams.to,
          //     true,
          //     resolution
          //   );
          // console.log("getBars", cac);

          const { bars, isLong, pool } = await helper.getSymbolBarsFromPonder(
            symbolInfo.name,
            periodParams.from,
            periodParams.to,
            resolution,
            cacheGetPools
          );

          // console.log({
          //   symbol: symbolInfo.name,
          //   from: new Date(periodParams.from * 1000),
          //   to: new Date(periodParams.to * 1000),
          //   bars: bars.length,

          //   fromRaw: periodParams.from,
          //   toRaw: periodParams.to,
          //   requiredBars: periodParams.countBack
          // });

          if (bars.length === 0) {
            const nextTime = await helper.sdk.ponderClient.getNextTime(
              periodParams.from,
              pool,
              isLong
            );

            if (nextTime == undefined) {
              onHistoryCallback([], {
                noData: true
              });
            } else {
              onHistoryCallback([], {
                noData: false,
                nextTime: nextTime
              });
            }

            return;
          }

          onHistoryCallback(bars, { noData: false });
        } catch (error) {
          console.error(`ERROR:`, error);
          onHistoryCallback([], {
            noData: true
          });
        }
      }, 5);
    },

    async subscribeBars(
      symbolInfo,
      resolution,
      onTickCallback,
      listenerGuid,
      onResetCacheNeededCallback
    ) {
      // console.log("UID", listenerGuid);
      const { pool, isLong } = await helper.getPoolFromName(
        symbolInfo.name,
        cacheGetPools
      );
      const val = ws.channelToSubscription.get(listenerGuid);
      if (val) {
        val.callbacks.push(onTickCallback);
      } else {
        ws.channelToSubscription.set(listenerGuid, {
          callbacks: [onTickCallback]
        });
      }
      ws.socket.emit(
        "Get::UpdateTradingViewPrice5M",
        pool.toLowerCase(),
        isLong,
        listenerGuid
      );
    },

    unsubscribeBars(listenerGuid) {}
  };
  return PotentiaDatafeed;
}
