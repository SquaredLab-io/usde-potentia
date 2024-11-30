import { TradeflowLayout } from "@lib/types/enums";
import { Tx } from "@squaredlab-io/sdk/src/interfaces/index.interface";

export function getTradeflowData(layout: TradeflowLayout, data: Tx[] | undefined) {
  if (!data) return [];
  // Filtering Open Long and Short positions and sorting them in decending order wrt timestamp
  const _data = data
    .filter((d) => d.action === "OL" || d.action === "OS")
    .sort((a, b) => parseInt(b.dateTime) - parseInt(a.dateTime));
  switch (layout) {
    case TradeflowLayout.all:
      return _data;
    case TradeflowLayout.positive:
      return _data.filter((d) => d.action === "OL");
    case TradeflowLayout.negative:
      return _data.filter((d) => d.action === "OS");
  }
}
