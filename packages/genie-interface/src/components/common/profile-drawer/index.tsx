import { FC, ReactNode } from "react";
import { Trophy } from "lucide-react";
import Image from "next/image";
import AppDrawer from "../AppDrawer";
import { useAccount, useBalance } from "wagmi";
import { getDecimalAdjusted, shortenHash } from "@lib/utils/formatting";
import { getIconPath } from "@lib/utils";
import { Separator } from "@components/ui/separator";
import Link from "next/link";
import { useUserPoints } from "@lib/hooks/useUserPoints";
import { LeaderboardOptions } from "@components/Points/sections/helper";

interface ProfileDrawerProps {
  children: ReactNode;
}

const ProfileDrawer: FC<ProfileDrawerProps> = ({ children }) => {
  const { address, connector } = useAccount();
  const { data, isLoading, isSuccess } = useBalance({
    address
  });

  const { userPointsData, isFetching, isPending } = useUserPoints({
    address
  });
  const pointsLoading = isFetching || isPending;
  const userPoints = userPointsData?.userPoints!;

  return (
    <AppDrawer
      trigger={children}
      className="bg-[#0C1820] border border-[#1F2D3F] shadow-lg max-w-md mx-auto"
    >
      {/* Wallet Section */}
      <div className="py-5 px-3">
        <p className="text-white text-base/5 font-light mb-4">Your Wallet Address</p>
        <div className="flex items-center gap-4">
          <Image
            src={getIconPath(connector?.id!)}
            height={36}
            width={36}
            alt="connector icon"
            priority
          />
          <span className="text-white text-2xl tracking-tight">
            {shortenHash(address, 5, 4)}
          </span>
        </div>
      </div>

      <Separator />

      {/* Balance Section */}
      <div className="py-5 px-3">
        <p className="text-white text-base/5 font-light mb-4">Your Balance</p>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-[#627EEA] flex items-center justify-center">
            <Image
              src="/tokens/eth.svg"
              alt="ETH balance"
              width={16}
              height={16}
              priority
            />
          </div>
          <span className="text-white text-2xl tracking-tight">
            {isLoading
              ? "..."
              : isSuccess
                ? getDecimalAdjusted(data.value.toString(), data.decimals).toFixed(4)
                : "0"}
          </span>
        </div>
      </div>

      <Separator />

      {/* Gpoints Section */}
      <div className="py-5 px-3 mb-8">
        <p className="text-white text-base/5 font-light mb-4">Your Gpoints</p>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-[#ADB2AB] text-xs/[14px] font-light">Points</p>
            <div className="flex items-center gap-4">
              <Image
                src="/icons/PointsIcon.svg"
                alt="Genie Points | GPoints"
                height={32}
                width={32}
              />
              <span className="text-[#E6E6E6] text-2xl/7">
                {pointsLoading ? "-" : userPoints.points}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-[#ADB2AB] text-xs/[14px] font-light">Rank</p>
            <span className="text-[#E6E6E6] text-2xl/8">
              {pointsLoading ? "-" : userPoints.rank}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-[#ADB2AB] text-xs/[14px] font-light">Multiplier</p>
            <div className="bg-[#27AE6033]/20 px-4 rounded">
              <span className="text-[#07AE3B] text-2xl/8">NA</span>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <Link
        className="inline-flex items-center gap-2 text-[#ADB2AB] text-xs px-3"
        href="/"
      >
        <span>How it works</span>
        <svg
          width="9"
          height="7"
          viewBox="0 0 9 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L4.5 5L8 1" stroke="#ADB2AB" strokeWidth="1.5" />
        </svg>
      </Link>

      {/* Leaderboard Button */}
      <Link
        className="pt-3 pb-4 px-3"
        href={{
          pathname: "/points",
          query: {
            show: LeaderboardOptions.leaderboard
          }
        }}
        as={`/points?show=${LeaderboardOptions.leaderboard}`}
        // onClick={() => onOpenChange(false)}
      >
        <button className="group w-full py-3 border-[0.5px] inline-flex items-center justify-center gap-x-1 border-[#D9D9D9] hover:bg-[#E6E6E6] transition-colors duration-200 ease-in-out">
          <Trophy
            size={16}
            className="text-[#C1C1C1] group-hover:text-black transition-colors duration-200"
          />
          <span className="font-normal text-sm/6 text-[#C1C1C1] group-hover:text-black transition-colors duration-200">
            Leaderboard
          </span>
        </button>
      </Link>
    </AppDrawer>
  );
};

export default ProfileDrawer;
