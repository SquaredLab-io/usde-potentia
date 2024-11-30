import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { cn } from "@lib/utils";
import { Separator } from "@components/ui/separator";
import { useFilteredPools } from "@lib/hooks/useFilteredPools";
import SearchInput from "./SearchInput";
import PoolsList from "./PoolsList";
import { PopoverSizes } from "@lib/types/common";
import { usePoolsStore } from "@store/poolsStore";

enum PoolSelectTypes {
  all = "all",
  pools = "pools",
  coins = "coins"
}

interface PropsType {
  size: PopoverSizes;
  children?: ReactNode | undefined;
}

export default function TokenSelectPopover({ size, children }: PropsType) {
  // Search term
  const [term, setTerm] = useState("");

  const isCompact = size === "compact";

  const { poolsData, updateSelectedPool } = usePoolsStore((state) => state);
  const { pools, noPools } = useFilteredPools(poolsData, term);

  const tabStyle = cn(
    "px-[10px] py-1 rounded border border-secondary-gray hover:bg-[#15212A]",
    "data-[state=active]: data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-white"
  );

  return (
    <Popover>
      <PopoverTrigger className="min-w-fit" asChild aria-label="Popover trigger">
        {children}
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-full border border-secondary-gray",
          isCompact ? "max-w-fit" : "max-w-[640px]"
        )}
        align="end"
      >
        <SearchInput
          term={term}
          setTerm={setTerm}
          placeholder="Search markets"
          className="px-4 mt-4"
        />
        <Tabs defaultValue={PoolSelectTypes.all}>
          <TabsList className="inline-flex p-4 font-normal text-[10px]/6 gap-2">
            <TabsTrigger value={PoolSelectTypes.all} className={tabStyle}>
              All Market
            </TabsTrigger>
            <TabsTrigger value={PoolSelectTypes.pools} className={tabStyle}>
              Liquidity Pools
            </TabsTrigger>
            <TabsTrigger
              value={PoolSelectTypes.coins}
              className={tabStyle}
              disabled
              aria-disabled="true"
            >
              Coins
            </TabsTrigger>
          </TabsList>
          <Separator />
          <header className="mb-2 mt-4 inline-flex w-full px-4 justify-between font-medium text-xs/4 font-sans-ibm-plex text-[#9299AA]">
            <h4>Market</h4>
            {isCompact ? (
              <h4>Power</h4>
            ) : (
              <>
                <h4>Price</h4>
                <h4>24h Change</h4>
                <h4>24h Volume</h4>
              </>
            )}
          </header>
          <TabsContent value={PoolSelectTypes.all}>
            <PoolsList pools={pools!} updateSelectedPool={updateSelectedPool} noPools={noPools} size={size} />
          </TabsContent>
          <TabsContent value={PoolSelectTypes.pools}>
            {/* <PoolsList
              pools={pools}
              noPools={noPools}
              updateSelectedPool={updateSelectedPool}
              size={size}
            /> */}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
