import { useState } from "react";
import { Separator } from "@components/ui/separator";
import { cn } from "@lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@components/ui/table";
import { TradeflowLayout } from "@lib/types/enums";
import { getTradeflowData } from "./helper";
import { useTradeHistory } from "@lib/hooks/useTradeHistory";
import { usePoolsStore } from "@store/poolsStore";
import toUnits, { formatOraclePrice } from "@lib/utils/formatting";
import LayoutSelector from "./layout-selector";

const TradeFlow = () => {
  const [tradeflowLayout, setTradeflowLayout] = useState<TradeflowLayout>(
    TradeflowLayout.all // default show all
  );

  const { selectedPool } = usePoolsStore();

  const { data, isFetching } = useTradeHistory();

  const tradeHistory = getTradeflowData(tradeflowLayout, data);

  return (
    <div className="hidden col-span-1 xl:flex flex-col border-l border-secondary-gray text-[1.2rem] min-w-[272.5px] w-[272.5px] h-full">
      <h1 className="font-medium text-sm/5 p-4">Trade Flow {isFetching && "..."}</h1>
      <Separator />
      <div className="flex flex-col pt-3 pl-3 h-full min-h-[374px] max-h-[calc(100vh-462px)]">
        {/* Layout Selections */}
        <LayoutSelector layout={tradeflowLayout} setLayout={setTradeflowLayout} />
        {/* TradeFlow table */}
        <Table>
          <TableHeader>
            <TableRow className="text-[#6A6A6D] text-xs/4">
              <TableHead className="font-normal pb-1">Price (USDC)</TableHead>
              <TableHead className="font-normal pb-1">
                Amount ({selectedPool()?.underlying.toUpperCase()})
              </TableHead>
              {/* <TableHead className="font-normal pb-1">Total</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tradeHistory.length > 0 ? (
              tradeHistory.map((tHistory, index) => {
                const dollarPrice = formatOraclePrice(tHistory.oraclePrice);
                const size = formatOraclePrice(tHistory.size);
                return (
                  <TableRow
                    key={`${tHistory.size}_${index}`}
                    className="font-normal text-[0.6875rem]/4"
                  >
                    <TableCell
                      className={cn(
                        "py-[2px]",
                        tHistory.action == "OL" ? "text-[#07AE3B]" : "text-[#FC0A52]"
                      )}
                    >
                      ${toUnits(dollarPrice * size, 2)}
                    </TableCell>
                    <TableCell className="py-[2px]">{toUnits(size, 3)}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="font-normal text-[0.6875rem]/4">
                {isFetching ? <span>...</span> : <span>No Data available</span>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TradeFlow;
