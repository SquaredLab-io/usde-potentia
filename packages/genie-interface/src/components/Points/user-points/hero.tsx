import { shortenHash } from "@lib/utils/formatting";
import { Address } from "viem";

interface Props {
  address: Address | undefined;
}

const Hero = ({ address }: Props) => {
  return (
    <div className="flex flex-col gap-y-2 items-start w-full">
      <h1 className="font-medium text-[2rem]/9">{shortenHash(address, 5, 4)}</h1>
    </div>
  );
};

export default Hero;
