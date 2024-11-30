import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@components/ui/table";
import { UserPoint, UserPointRank } from "@squaredlab-io/sdk";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { useAccount } from "wagmi";

interface PropsType<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}

const RewardsTable = <TData, TValue>({
  columns,
  data,
  loading
}: PropsType<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  return (
    <div className="w-full overflow-auto">
      <Table className="leaderboard">
        <TableHeader className={"font-sans-ibm-plex"}>
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
                  className=" bg-[#14252E] hover:bg-[#142F41] transition-colors duration-200 ease-linear leaderboard"
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
                {loading ? "Loading Rewards History..." : "No Rewards found."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RewardsTable;
