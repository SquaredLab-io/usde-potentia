import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { PoolInfo } from "@squaredlab-io/sdk";
import { ConstructedPoolsDataResponse } from "@lib/hooks/useFilteredPoolOverview";
import { usePoolsStore } from "@store/poolsStore";
import { useRouter } from "next/navigation";

interface PropsType<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  setOpen: (value: boolean) => void;
  pools: PoolInfo[];
}

const TokenSelectorTable = <TData, TValue>({
  columns,
  data,
  loading,
  setOpen,
  pools
}: PropsType<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  const router = useRouter();

  return (
    <Table>
      <TableHeader className="font-sans-ibm-plex">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="font-bold text-sm/[18px] text-[#5F7183] text-right pb-2"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const { poolAddr } = row.original as ConstructedPoolsDataResponse;
            return (
              <TableRow
                key={row.id}
                className="hover:bg-[#19242C] transition-colors duration-200 cursor-pointer"
                onClick={() => {
                  const selectedPool = pools.find((p) => p.poolAddr === poolAddr)!;
                  router.push(
                    `/trade/${selectedPool?.underlying}-${selectedPool?.power}`
                  );
                  setOpen(false);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-right">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-72 text-center">
              {loading ? "Loading Pools..." : "You have no pools."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TokenSelectorTable;
