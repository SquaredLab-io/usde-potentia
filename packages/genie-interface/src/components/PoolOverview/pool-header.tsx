import Image from "next/image";
import DropDownIcon from "@components/icons/DropDownIcon";
import { useModalStore } from "@store/poolsStore";
import { useAccount } from "wagmi";
import { POOL_APR, POOL_FEE } from "./constants";
import Label from "./Label";

const PoolHeader = ({ assets, power }: { assets: string[]; power: number }) => {
  const { chain } = useAccount();
  const { setOpenSelectPoolOverviewModal } = useModalStore();
  return (
    <>
      <div
        className="whitespace-nowrap flex flex-row items-center gap-3 text-left font-medium rounded-full max-w-fit p-2 cursor-pointer"
        onClick={() => setOpenSelectPoolOverviewModal(true)}
      >
        <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-3">
          {assets.map((asset, index) => (
            <div
              key={`${asset}_${index}`}
              className="z-0 flex overflow-hidden ring-2 ring-white rounded-full bg-neutral-800"
            >
              <Image
                src={`/tokens/${asset.toLowerCase()}.svg`}
                alt={asset}
                width={42}
                height={42}
              />
            </div>
          ))}
        </div>
        <p className="font-extrabold text-[32px]/5 text-nowrap">
          {assets[0]}
          <span className="text-[#9299AA] mx-2">/</span>
          {assets[1]}
        </p>
        <p className="font-medium text-xs/3 bg-[#49AFE9] pt-[4.5px] pb-[5.5px] px-3 rounded-md">
          p = {power}
        </p>
        <DropDownIcon className="ml-2" />
      </div>
      {/* Labels of Pool Information */}
      <div className="inline-flex items-center mt-3 gap-1">
        <Label text={`APR : ${POOL_APR}%`} />
        <Label text={`Fee : ${POOL_FEE}%`} />
        {chain && <Label text={`Network : Base Sepolia`} />}
      </div>
    </>
  );
};

export default PoolHeader;
