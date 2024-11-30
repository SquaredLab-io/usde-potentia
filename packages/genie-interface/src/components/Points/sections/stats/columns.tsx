import { timestampToDate } from "@lib/utils/formatting";
import { UserPointHistory } from "@squaredlab-io/sdk";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const rewardsMobileColumns: ColumnDef<UserPointHistory>[] = [
  {
    id: "action",
    accessorKey: "action",
    header: () => (
      <div className="pl-6 w-full flex items-start">
        <span>Recent Rewards</span>
      </div>
    ),
    cell: ({ row }) => {
      const { points, action } = row.original;
      const isLong = action.toLowerCase() === "close long";
      return (
        <div className="pl-6 whitespace-nowrap flex flex-row items-center gap-x-4">
          <Image
            src={isLong ? "/icons/LongPositionIcon.svg" : "/icons/ShortPositionIcon.svg"}
            alt="Rewards action"
            height={45}
            width={45}
          />
          <div className="flex flex-col gap-y-1 text-left text-sm/5 font-bold pl-6 py-3">
            <p className="text-white opacity-95">
              Earned {points} {points > 1 ? "Gpoints" : "Gpoint"}
            </p>
            <p className="font-normal text-[#9299AA]">
              {isLong ? "Closed Long" : "Closed Short"} Position
            </p>
          </div>
        </div>
      );
    }
  },
  {
    id: "points",
    accessorKey: "points",
    header: () => (
      <div className="w-full">
        <span>Points</span>
      </div>
    ),
    cell: ({ row }) => {
      const { points } = row.original;
      return (
        <span className="text-[#00A3FF]">
          {points} {points > 1 ? "Gpoints" : "Gpoint"}
        </span>
      );
    }
  }
];

export const rewardsColumns: ColumnDef<UserPointHistory>[] = [
  {
    id: "action",
    accessorKey: "action",
    header: () => (
      <div className="pl-6 w-full flex items-start">
        <span>Recent Rewards</span>
      </div>
    ),
    cell: ({ row }) => {
      const { points, action } = row.original;
      const isLong = action.toLowerCase() === "close long";
      return (
        <div className="pl-6 whitespace-nowrap flex flex-row items-center gap-x-4">
          <Image
            src={isLong ? "/icons/LongPositionIcon.svg" : "/icons/ShortPositionIcon.svg"}
            alt="Rewards action"
            height={45}
            width={45}
          />
          <div className="flex flex-col gap-y-1 text-left text-sm/5 font-bold pl-6 py-3">
            <p className="text-white opacity-95">
              Earned {points} {points > 1 ? "Gpoints" : "Gpoint"}
            </p>
            <p className="font-normal text-[#9299AA]">
              {isLong ? "Closed Long" : "Closed Short"} Position
            </p>
          </div>
        </div>
      );
    }
  },
  {
    id: "points",
    accessorKey: "points",
    header: () => (
      <div className="w-full">
        <span>Points</span>
      </div>
    ),
    cell: ({ row }) => {
      const { points } = row.original;
      return (
        <span className="text-[#00A3FF]">
          {points} {points > 1 ? "Gpoints" : "Gpoint"}
        </span>
      );
    }
  },
  {
    id: "date",
    accessorKey: "date",
    header: () => (
      <div className="pr-4 w-full text-center">
        <span>Date</span>
      </div>
    ),
    cell: ({ row }) => {
      const { timestamp } = row.original;
      return <div>{timestampToDate(timestamp)}</div>;
    }
  }
];
