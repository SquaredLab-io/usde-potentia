"use client";

import { meta } from "@lib/constants";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="heading-gradient font-medium text-[32px]/9">Pools</h1>
      <h4 className="font-normal text-base/[22px] text-[#98B0C1]">
        Earn fees & rewards by deploying liquidity into Pools.
        <Link
          href={meta.DOCS}
          className="inline-flex items-center gap-[6px] ml-1 text-[#00A3FF]"
          target="_blank"
        >
          How it works?
        </Link>
      </h4>
    </div>
  );
};

export default Hero;
