import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@components/ui/table";
import { cn } from "@lib/utils";
import { UserPoint, UserPointRank } from "@squaredlab-io/sdk";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { useAccount } from "wagmi";

interface PropsType<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  isRank?: boolean;
}

const LeaderboardTable = <TData, TValue>({
  columns,
  data,
  loading,
  isRank = false
}: PropsType<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const { isConnected } = useAccount();
  const router = useRouter();

  const isDesktop = useMediaQuery("(min-width: 768px)"); // tailwind `md`

  return (
    <div className="w-full overflow-auto mb-1">
      <Table className="leaderboard">
        <TableHeader
          className={cn(
            "font-sans-ibm-plex",
            ((!isRank && isConnected) || !isDesktop) && "hidden"
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="font-bold text-sm/[18px] text-header-gray text-center"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const { id } = row.original as UserPoint | UserPointRank;
              return (
                <TableRow
                  key={row.id}
                  className="bg-[#0F212B] hover:bg-[#142F41] transition-colors duration-200 ease-linear cursor-pointer leaderboard"
                  onClick={() => {
                    router.push(`/points/user?address=${id}`);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="font-bold text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-72 text-center">
                {loading ? "Loading Leaderboard..." : "No List found."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
