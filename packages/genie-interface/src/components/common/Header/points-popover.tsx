import { FC, memo, PropsWithChildren } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Trophy } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Separator } from "@components/ui/separator";
import { UserPointsType } from "@lib/hooks/useUserPoints";
import { LeaderboardOptions } from "@components/Points/sections/helper";

interface PointsPopoverProps extends PropsWithChildren {
  points: UserPointsType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PointsPopover: FC<PointsPopoverProps> = ({
  children,
  points,
  isOpen,
  onOpenChange
}) => {
  const { userPointsData, isFetching, isPending } = points;
  const userPoints = userPointsData?.userPoints;
  const loading = isFetching || isPending;

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange} modal={true}>
      <PopoverTrigger asChild className="min-w-fit z-50">
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="bg-[#071A26] border-none rounded p-0"
        onMouseLeave={() => onOpenChange(false)}
      >
        <h1 className="py-4 pl-4 w-full font-medium text-base/5">Your Gpoints</h1>
        <Separator />
        <div className="px-4 pt-3 pb-4 flex flex-col gap-6">
          <div className="flex flex-row items-center justify-between font-normal text-base/5 text-[#E6E6E6]">
            <div className="flex flex-col items-start gap-2">
              <p className="inline-flex gap-x-1 font-light text-[13px]/4 text-[#ADB2AB]">
                <Image
                  src="/icons/PointsIcon.svg"
                  alt="Genie Points | GPoints"
                  height={16}
                  width={16}
                />
                <span>Points</span>
              </p>
              <span>{loading ? "..." : !userPoints ? "NA" : userPoints.points}</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="font-light text-[13px]/4 text-[#ADB2AB]">Rank</span>
              <span>{loading ? "..." : !userPoints ? "NA" : userPoints.rank}</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="font-light text-[13px]/4 text-[#ADB2AB]">Multiplier</span>
              <span>NA</span>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center group max-w-fit"
            >
              <span className="font-light text-xs/4 text-[#ADB2AB] group-hover:text-white transition-colors duration-200">
                How it works
              </span>
              <ArrowUpRight
                size={12}
                className="ml-1 text-[#ADB2AB] group-hover:text-white"
              />
            </Link>
            <Link
              href={{
                pathname: "/points",
                query: {
                  show: LeaderboardOptions.leaderboard
                }
              }}
              as={`/points?show=${LeaderboardOptions.leaderboard}`}
              onClick={() => onOpenChange(false)}
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
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default memo(PointsPopover);
