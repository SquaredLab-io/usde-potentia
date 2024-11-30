import Image from "next/image";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { useModalStore } from "@store/poolsStore";

const TokenSelector = ({ selectedPool }: { selectedPool: PoolInfo | undefined }) => {
  const { setOpenTokenSelectorModal } = useModalStore();
  return (
    <button
      className="group flex flex-row justify-normal items-center text-left py-3 px-3 lg:px-5 gap-2 min-w-fit"
      onClick={() => setOpenTokenSelectorModal(true)}
    >
      {/* Tokens Images */}
      <div className="z-0 flex overflow-hidden ring-1 ring-primary-gray rounded-full bg-secondary-gray">
        <Image
          src={`/tokens/${selectedPool?.underlying.toLowerCase()}.svg`}
          alt="token icon"
          width={32}
          height={32}
        />
      </div>
      {/* Tokens Symbols */}
      <div className="inline-flex items-center gap-2">
        <span className="text-base/5 font-medium text-nowrap">
          {selectedPool?.pool.split(" / ").join("")}
        </span>
        <span className="text-nowrap font-normal text-xs/[14px] rounded-sm py-[2px] px-1 opacity-90 bg-gradient-cyan">
          p = {selectedPool?.power}
        </span>
      </div>
      {/* Drop Menu Icon */}
      <Image
        src="/icons/MenuDropIcon.svg"
        className="ml-2 opacity-80 group-hover:opacity-100 transition-opacity"
        width={20}
        height={20}
        alt="menu-icon"
      />
    </button>
  );
};

export default TokenSelector;
