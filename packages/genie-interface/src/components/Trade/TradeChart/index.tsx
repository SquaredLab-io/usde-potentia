"use client";

import { useEffect, useRef, memo, MutableRefObject, useState, useCallback } from "react";
import {
  ConfigurationData,
  ExternalFeed,
  PotentiaSdk,
  Timezone,
  getPotentiaDataFeed
} from "@squaredlab-io/sdk/src";
import debounce from "lodash/debounce";
import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  widget
} from "../../../../public/static/charting_library";
import { usePoolsStore } from "@store/poolsStore";
import { defaultWidgetProps as widgetProps } from "./defaultWidgetProps";
import { useTradeStore } from "@store/tradeStore";

interface PropsType {
  potentia: PotentiaSdk;
}

const TradeChart = ({ potentia }: PropsType) => {
  const { selectedPool } = usePoolsStore();
  const { tradeType } = useTradeStore();
  const [dataFeed, setDataFeed] = useState<ExternalFeed | null>(null);

  // Chart Container and Widget Refs
  const chartContainerRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLInputElement>;
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);

  const getSymbol = useCallback(() => {
    if (selectedPool()) {
      return `${selectedPool()?.underlying}^${selectedPool()?.power} ${tradeType.toUpperCase()}`;
    }
    return "";
  }, [selectedPool, tradeType]);

  const updateSymbol = useCallback(
    debounce((newSymbol: string) => {
      if (!tvWidgetRef.current || !dataFeed) return;
      tvWidgetRef.current.setSymbol(
        newSymbol,
        widgetProps.interval as ResolutionString,
        () => {}
      );
    }, 300),
    [dataFeed]
  );

  useEffect(() => {
    async function initDatafeed() {
      if (!potentia) return;
      const newDataFeed = await getPotentiaDataFeed(potentia, ConfigurationData, true);
      setDataFeed(newDataFeed);
    }
    initDatafeed();
  }, [potentia]);

  useEffect(() => {
    if (!dataFeed || !selectedPool()) return;

    function initChart() {
      // Retrieve the saved timezone from localStorage
      const savedTimezone =
        (localStorage.getItem("chartTimezone") as "exchange" | Timezone | undefined) ||
        widgetProps.timezone;

      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: getSymbol(),
        // BEWARE: no trailing slash is expected in feed URL
        datafeed: dataFeed!,
        timezone: savedTimezone,
        interval: widgetProps.interval as ResolutionString,
        container: chartContainerRef.current,
        library_path: widgetProps.library_path,
        locale: widgetProps.locale as LanguageCode,
        disabled_features: widgetProps.disabled_features,
        enabled_features: widgetProps.enabled_features,
        charts_storage_url: widgetProps.charts_storage_url,
        charts_storage_api_version: widgetProps.charts_storage_api_version,
        client_id: widgetProps.client_id,
        user_id: widgetProps.user_id,
        fullscreen: widgetProps.fullscreen,
        autosize: widgetProps.autosize,
        theme: widgetProps.theme,
        debug: widgetProps.debug,
        symbol_search_request_delay: widgetProps.symbol_search_request_delay,
        auto_save_delay: widgetProps.auto_save_delay,
        toolbar_bg: widgetProps.toolbar_bg,
        overrides: widgetProps.overrides,
        loading_screen: widgetProps.loading_screen
      };

      const tvWidget = new widget(widgetOptions);
      tvWidgetRef.current = tvWidget;

      tvWidget.onChartReady(() => {
        injectCustomCSS(tvWidget);
        tvWidget.subscribe("onAutoSaveNeeded", () => {
          const currentTimezone = tvWidget.chart().getTimezoneApi().getTimezone();
          localStorage.setItem("chartTimezone", currentTimezone.id);
        });
      });
    }

    // Only re-initialise the chart when it's doesn't exists
    if (!tvWidgetRef.current) {
      initChart();
    } else {
      // Update existing chart's symbol
      updateSymbol(getSymbol());
    }

    // Cleanup function
    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
      }
    };
  }, [dataFeed, selectedPool, tradeType, getSymbol, updateSymbol]);

  function injectCustomCSS(tvWidget: IChartingLibraryWidget) {
    tvWidget.addCustomCSSFile(
      "data:text/css;base64," +
        btoa(`
          div[data-name="legend-source-title"] {
            pointer-events: none !important;
          }
          .centerElement-kfvcmk8t {
            display: none !important;
          }
          html.theme-dark {
            --tv-color-pane-background: #0C1820;
          }
        `)
    );
  }

  return <div ref={chartContainerRef} className="col-span-4" />;
};

export default memo(TradeChart);
