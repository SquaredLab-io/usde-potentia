import { ColumnDef } from "@tanstack/react-table";
import { shortenHash } from "@lib/utils/formatting";
import { UserPoint, UserPointRank } from "@squaredlab-io/sdk";
import { formatTradeValue } from "../helper";

export const leaderboardColumns: ColumnDef<UserPoint>[] = [
  {
    id: "rank",
    accessorKey: "rank",
    header: () => (
      <div className="pl-6 pb-4 w-full flex items-start">
        <span>Rank</span>
      </div>
    ),
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div className="whitespace-nowrap flex flex-col gap-y-1 text-left text-sm font-bold/5 pl-6 py-3">
          <p className="text-white">Rank: {row.index + 1}</p>
          <p className="font-normal text-[#9299AA]">{shortenHash(id)}</p>
        </div>
      );
    }
  },
  {
    id: "volume",
    accessorKey: "tradingVolume",
    header: () => (
      <div className="w-full pb-4">
        <span>Trading Volume</span>
      </div>
    ),
    cell: ({ row }) => {
      const { volume } = row.original;
      return <span className="text-center">{formatTradeValue(false, volume)}</span>;
    }
  },
  {
    id: "pnl",
    accessorKey: "pnl",
    header: () => (
      <div className="w-full pb-4">
        <span>Total P&L</span>
      </div>
    ),
    cell: ({ row }) => {
      const { profit } = row.original;
      return <span>{formatTradeValue(false, profit)}</span>;
    }
  },
  {
    id: "points",
    accessorKey: "points",
    header: () => (
      <div className="pb-4 pr-4 w-full text-right">
        <span>Points</span>
      </div>
    ),
    cell: ({ row }) => {
      const { points } = row.original;
      const growth = parseFloat("0");
      return (
        <div className="w-full text-right pr-6 pl-6 text-[#00A3FF]">{points} Gpoints</div>
      );
    }
  }
];

export const leaderboardMobileColumns: ColumnDef<UserPoint>[] = [
  {
    id: "rank",
    accessorKey: "rank",
    header: () => (
      <div className="pl-6 pb-4 w-full flex items-start">
        <span>Rank</span>
      </div>
    ),
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div className="whitespace-nowrap flex flex-col gap-y-1 text-left text-sm font-bold/5 pl-6 py-3">
          <p className="text-white">Rank: {row.index + 1}</p>
          <p className="font-normal text-[#9299AA]">{shortenHash(id)}</p>
        </div>
      );
    }
  },
  {
    id: "points",
    accessorKey: "points",
    header: () => (
      <div className="pb-4 pr-4 w-full text-right">
        <span>Points</span>
      </div>
    ),
    cell: ({ row }) => {
      const { points } = row.original;
      const growth = parseFloat("0");
      return (
        <div className="w-full text-right pr-6 pl-6 text-[#00A3FF]">{points} Gpoints</div>
      );
    }
  }
];

export const rankColumns: ColumnDef<UserPointRank>[] = [
  {
    id: "rank",
    accessorKey: "rank",
    header: () => (
      <div className="pl-6 pb-4 w-full flex items-start">
        <span>Rank</span>
      </div>
    ),
    cell: ({ row }) => {
      const { id, rank } = row.original;
      return (
        <div className="whitespace-nowrap flex flex-col gap-y-1 text-left text-sm font-bold/5 pl-6 py-3">
          <p className="text-[#00A3FF]">Your Rank: {rank}</p>
          <p className="font-normal text-[#9299AA]">{shortenHash(id)}</p>
        </div>
      );
    }
  },
  {
    id: "volume",
    accessorKey: "tradingVolume",
    header: () => (
      <div className="w-full pb-4">
        <span>Trading Volume</span>
      </div>
    ),
    cell: ({ row }) => {
      const { volume } = row.original;
      return <span className="text-center">{formatTradeValue(false, volume)}</span>;
    }
  },
  {
    id: "pnl",
    accessorKey: "pnl",
    header: () => (
      <div className="w-full pb-4">
        <span>Total P&L</span>
      </div>
    ),
    cell: ({ row }) => {
      const { profit } = row.original;
      return <span>{formatTradeValue(false, profit)}</span>;
    }
  },
  {
    id: "points",
    accessorKey: "points",
    header: () => (
      <div className="pb-4 pr-4 w-full text-right">
        <span>Points</span>
      </div>
    ),
    cell: ({ row }) => {
      const { points } = row.original;
      const growth = parseFloat("0");
      return (
        <div className="w-full text-right pr-6 pl-6 text-[#00A3FF]">{points} Gpoints</div>
      );
    }
  }
];

export const rankMobileColumns: ColumnDef<UserPointRank>[] = [
  {
    id: "rank",
    accessorKey: "rank",
    header: () => (
      <div className="pl-6 pb-4 w-full flex items-start">
        <span>Rank</span>
      </div>
    ),
    cell: ({ row }) => {
      const { id, rank } = row.original;
      return (
        <div className="whitespace-nowrap flex flex-col gap-y-1 text-left text-sm font-bold/5 pl-6 py-3">
          <p className="text-[#00A3FF]">Your Rank: {rank}</p>
          <p className="font-normal text-[#9299AA]">{shortenHash(id)}</p>
        </div>
      );
    }
  },
  {
    id: "points",
    accessorKey: "points",
    header: () => (
      <div className="pb-4 pr-4 w-full text-right">
        <span>Points</span>
      </div>
    ),
    cell: ({ row }) => {
      const { points } = row.original;
      const growth = parseFloat("0");
      return (
        <div className="w-full text-right pr-6 pl-6 text-[#00A3FF]">{points} Gpoints</div>
      );
    }
  }
];
