import { memo } from "react";
import Image from "next/image";
import { PopoverSizes } from "@lib/types/common";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { getPoolTokens } from "@lib/utils/pools";

interface PoolsListProps {
  pools: PoolInfo[];
  updateSelectedPool: (value: PoolInfo) => void;
  noPools: boolean;
  size: PopoverSizes;
}

const PoolsList = ({ pools, updateSelectedPool, noPools, size }: PoolsListProps) => {
  if (noPools) {
    return <div className="flex-row-center w-full h-20 opacity-50">No pools found</div>;
  }

  return (
    <div className="flex flex-col mb-2">
      {pools.map((_pool) => {
        const { pool, underlying, power } = _pool;
        const assets = getPoolTokens(pool);
        return (
          <button
            key={pool}
            className="flex flex-row px-4 py-2 w-full justify-between items-center gap-2 hover:bg-[#15212A] transition-colors duration-300"
            onClick={() => {
              const selectedPool = pools.find((p) => p.poolAddr === _pool.poolAddr)!;
              updateSelectedPool(selectedPool);
            }}
          >
            <div className="inline-flex items-center gap-1">
              <div className="z-0 flex overflow-hidden ring-0 rounded-full bg-secondary-gray">
                <Image
                  src={`/tokens/${underlying.toLowerCase()}.svg`}
                  alt={`${underlying} token icon`}
                  width={24}
                  height={24}
                />
              </div>
              <p>
                {assets.map((asset, index) => (
                  <span key={`${asset}_${index}`}>
                    {asset}
                    {assets.length !== index + 1 && <span>-</span>}
                  </span>
                ))}
              </p>
            </div>
            <span className="font-medium text-2xs/[14px] rounded-sm py-px px-[4.5px] text-white bg-text-grad bg-gradient-blue">
              p = {power}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default memo(PoolsList);
