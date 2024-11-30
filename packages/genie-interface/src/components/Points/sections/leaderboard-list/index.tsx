import LeaderboardTable from "./table";
import {
  leaderboardColumns,
  leaderboardMobileColumns,
  rankColumns,
  rankMobileColumns
} from "./columns";
import { useLeaderboard } from "@lib/hooks/useLeaderboard";
import { useUserPoints } from "@lib/hooks/useUserPoints";
import { useAccount } from "wagmi";
import { useMediaQuery } from "usehooks-ts";
import { useMemo } from "react";

const LeaderboardList = () => {
  const { isConnected, address } = useAccount();

  const isDesktop = useMediaQuery("(min-width: 768px)"); // tailwind `md`

  const { ranks, isFetching, isPending } = useLeaderboard();
  const {
    userPointsData,
    isFetching: isPointsFetching,
    isPending: isUserPending
  } = useUserPoints({ address });
  const userPoints = userPointsData?.userPoints;

  const rankCol = useMemo(() => {
    return isDesktop ? rankColumns : rankMobileColumns;
  }, [isDesktop]);
  const leaderboardCol = useMemo(() => {
    return isDesktop ? leaderboardColumns : leaderboardMobileColumns;
  }, [isDesktop]);

  return (
    <div className="py-4 w-full flex flex-col gap-4 md:gap-10">
      <Heading />
      {isConnected && (
        <LeaderboardTable
          data={userPoints ? [userPoints] : []}
          columns={rankCol}
          loading={isPointsFetching || isUserPending}
          isRank={true}
        />
      )}
      <LeaderboardTable
        data={ranks ?? []}
        columns={leaderboardCol}
        loading={isFetching || isPending}
      />
    </div>
  );
};

const Heading = () => (
  <div className="flex flex-col gap-y-2 items-start pt-0 md:pt-10">
    <h1 className="font-medium text-2xl/9">
      <span className="heading-gradient">Genie</span> Ranking
    </h1>
    <p className="font-normal text-base/[22px] text-[#98B0C1]">
      See how you rank against other Crypto Knights on GenieDex
    </p>
  </div>
);

export default LeaderboardList;
