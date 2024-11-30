"use client";

import { useSearchParams } from "next/navigation";
import { Address } from "viem";
import UserPoints from "@components/Points/user-points";
import Hero from "@components/Points/user-points/hero";

export default function UserStats() {
  const queryParams = useSearchParams();
  const userAddr = queryParams.get("address") ?? undefined;

  return (
    <main className="pl-3 md:pl-[88px] pr-3 md:pr-[84px] pt-16 pb-4 md:pb-10 overflow-hidden">
      <Hero address={userAddr as Address} />
      <div className="py-4 mt-10 border-t border-b border-secondary-gray">
        <button className="py-2 px-6 max-w-fit rounded-lg border border-tab-blue bg-[#0A344D] shadow-sm">
          <span className="font-medium text-sm/5">Stats</span>
        </button>
      </div>
      <UserPoints address={userAddr as Address} />
    </main>
  );
}
