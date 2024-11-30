import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@components/ui/select";
import { LpTradeOptions } from "@lib/types/enums";
import { MinusIcon, PlusIcon } from "lucide-react";

export default function LpTradeSelector({
  lpTrade,
  setLpTrade
}: {
  lpTrade: LpTradeOptions;
  setLpTrade: (value: LpTradeOptions) => void;
}) {
  return (
    <Select
      value={lpTrade}
      onValueChange={(value) => setLpTrade(value as LpTradeOptions)}
    >
      <SelectTrigger className="max-w-fit bg-[#212C42] rounded-lg py-2">
        <SelectValue>{lpTrade}</SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-lg bg-primary-gray border border-secondary-gray w-48">
        {lpTrade !== LpTradeOptions.supply && (
          <SelectItem className="px-4 pt-3 pb-2" value={LpTradeOptions.supply}>
            <span className="inline-flex items-center gap-2 text-nowrap">
              <PlusIcon className="w-[14px]" />
              Supply Liquidity
            </span>
          </SelectItem>
        )}
        {lpTrade !== LpTradeOptions.withdraw && (
          <SelectItem className="px-4 pt-3 pb-2" value={LpTradeOptions.withdraw}>
            <span className="inline-flex items-center gap-2 text-nowrap">
              <MinusIcon className="w-[14px]" />
              Withdraw Liquidity
            </span>
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
