import {
  ChartingLibraryWidgetOptions,
  ResolutionString
} from "../../../../public/static/charting_library/charting_library";

// Chart widget props
export const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  interval: "60" as ResolutionString,
  timeframe: "1D",
  library_path: "/static/charting_library/",
  timezone: "Etc/UTC",
  locale: "en",
  charts_storage_url: "https://saveload.tradingview.com",
  charts_storage_api_version: "1.1",
  client_id: "squaredlabs.io",
  user_id: "public_user_id",
  fullscreen: false,
  autosize: true,
  symbol_search_request_delay: 0,
  auto_save_delay: 5,
  theme: "dark", // or "light"
  toolbar_bg: "#0C1820", // Remove this line if present
  disabled_features: [
    "use_localstorage_for_settings",
    "header_symbol_search",
    "symbol_search_hot_key",
    "symbol_info"
  ],
  enabled_features: ["study_templates", "timezone_menu"],
  overrides: {
    "paneProperties.background": "#0C1820",
    "paneProperties.backgroundType": "solid"
  },
  loading_screen: {
    backgroundColor: "#0C1820"
  },
  debug: false
  // favorites: {
  //   intervals: ["1S", "1", "1D"] as ResolutionString[],
  //   chartTypes: ["Area", "Candles"]
  // },
  // time_frames: [
  //   {
  //     text: "1d",
  //     resolution: "5" as ResolutionString,
  //     description: "1 Day",
  //     title: "1D"
  //   },
  //   {
  //     text: "5D",
  //     resolution: "60" as ResolutionString,
  //     description: "5 Days",
  //     title: "5D"
  //   },
  //   { text: "1M", resolution: "240" as ResolutionString, description: "1 Month" },
  //   { text: "3M", resolution: "3D" as ResolutionString, description: "3 Months" },
  //   { text: "6M", resolution: "1D" as ResolutionString, description: "6 Months" },
  //   { text: "1Y", resolution: "1D" as ResolutionString, description: "1 Year" },
  //   { text: "5Y", resolution: "5D" as ResolutionString, description: "5 Years" },
  //   {
  //     text: "1000y",
  //     resolution: "1D" as ResolutionString,
  //     description: "All",
  //     title: "All"
  //   }
  // ]
};
