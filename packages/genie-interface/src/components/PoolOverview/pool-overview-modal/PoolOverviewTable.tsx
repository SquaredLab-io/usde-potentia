import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@components/ui/table";
import { ConstructedPoolsDataResponse } from "@lib/hooks/useFilteredPoolOverview";

interface PropsType<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  setOpen: (value: boolean) => void;
}

const PoolOverviewTable = <TData, TValue>({
  columns,
  data,
  loading,
  setOpen
}: PropsType<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

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
            const { underlying_symbol, power } =
              row.original as ConstructedPoolsDataResponse;
            return (
              <TableRow
                key={row.id}
                className="hover:bg-[#19242C] transition-colors duration-200"
                onClick={() => {
                  setOpen(false);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-right">
                    <Link href={`/pool/${underlying_symbol}?power=${power}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Link>
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

export default PoolOverviewTable;
