import { RefObject } from "react";
import { ChartOptions, ColorType, DeepPartial, LineStyle } from "lightweight-charts";

// lp chart ranges
export const intervals = ["1m", "5m", "30m", "1h", "12h", "1d"];

export const colors = {
  backgroundColor: "#0C1820",
  lineColorOne: "#FF7300",
  lineColorTwo: "#0099FF",
  lineColorThree: "#604DA7",
  lineColorFour: "green",
  feesSeriesColor: "#2D9CDB",
  textColor: "white",
  barColor: "#0099FF",
  areaColor: "#1F323D",
  spinnerColor: "#01A1FF",
  gridColor: "#1F2D3F"
};

export const chartOptionsConfig = (
  containerRef: RefObject<HTMLDivElement>
): DeepPartial<ChartOptions> => {
  return {
    layout: {
      background: { type: ColorType.Solid, color: colors.backgroundColor },
      textColor: colors.textColor,
      attributionLogo: false
    },
    width: containerRef.current?.clientWidth || 400,
    height: containerRef.current?.clientHeight || 300,
    watermark: {
      visible: false
    },
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0
      },
      borderVisible: false
    },
    autoSize: true, // Explicitly turn off autoSize
    grid: {
      vertLines: {
        color: colors.gridColor,
        style: LineStyle.Solid,
        visible: true
      },
      horzLines: {
        color: colors.gridColor,
        style: LineStyle.Solid,
        visible: true
      }
    },
    handleScale: {
      axisDoubleClickReset: true
    },
    handleScroll: {
      vertTouchDrag: false
    }
  };
};

export type CLInfo = {
  x: number;
  longPayoff: number;
  shortPayoff: number;
  cl: number;
  reserve: number;
};
