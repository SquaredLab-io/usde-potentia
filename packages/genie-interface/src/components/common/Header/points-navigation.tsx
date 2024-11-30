"use client";

import { memo, useMemo, useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useUserPoints } from "@lib/hooks/useUserPoints";
import PointsPopover from "./points-popover";

const PointsNavigation = () => {
  const [isPointsPopoverOpen, setIsPointsPopoverOpen] = useState(false);
  const { isConnected, address } = useAccount();
  const { userPointsData, isFetching, isPending, refetch } = useUserPoints({
    address
  });

  const userPoints = userPointsData?.userPoints;

  const displayPoints = useMemo(() => {
    if (!userPoints && (isFetching || isPending)) {
      return "...";
    }
    return userPoints?.points ?? "NA";
  }, [userPoints, isFetching, isPending]);

  return isConnected ? (
    <PointsPopover
      points={{ userPointsData, isFetching, isPending, refetch }}
      isOpen={isPointsPopoverOpen}
      onOpenChange={setIsPointsPopoverOpen}
    >
      <button
        className="inline-flex items-center gap-x-1 text-sm max-w-fit px-2 -mx-2 select-none hover:scale-105 active:scale-95 transition-transform duration-200"
        onMouseEnter={() => setIsPointsPopoverOpen(true)}
      >
        <Image
          src="/icons/PointsIcon.svg"
          alt="Genie Points | GPoints"
          height={24}
          width={24}
        />
        <span className="font-normal leading-5 ml-1">{displayPoints} Gpoints</span>
      </button>
    </PointsPopover>
  ) : (
    <></>
  );
};

export default memo(PointsNavigation);
