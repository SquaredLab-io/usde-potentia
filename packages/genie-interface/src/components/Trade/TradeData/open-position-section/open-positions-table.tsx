import { useAccount } from "wagmi";
import { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import NextImage from "@components/common/NextImage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@components/ui/table";

interface PropsType<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
}

const OpenPositionsTable = <TData, TValue>({
  columns,
  data,
  isLoading
}: PropsType<TData, TValue>) => {
  const memoizedCoreRowModal = useMemo(() => getCoreRowModel(), []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: memoizedCoreRowModal
  });

  const { isConnected } = useAccount();

  return useMemo(
    () => (
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="font-sans-ibm-plex font-bold text-xs/[18px] text-[#5F7183] pt-[18px] pb-3"
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
        <TableBody className="font-normal text-sm/4">
          {!isConnected ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="size-36 text-center w-full">
                <div className="flex flex-col items-center w-full text-center gap-5">
                  <span className="font-normal text-base/7 text-[#B5B5B5]">
                    Connect Wallet to view your transactions.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="-z-10">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="size-48 text-center">
                <div className="flex flex-col gap-2">
                  <NextImage
                    src="/icons/file-icon.svg"
                    className="size-[62px]"
                    altText="file icon"
                  />
                  <span className="text-[#B0B3B8] font-normal text-sm/6">
                    {isLoading ? "Fetching Open Positions..." : "No Open Positions."}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    ),
    [table, isConnected, columns.length, isLoading]
  );
};

OpenPositionsTable.displayName = "OpenPositionsTable";

export default OpenPositionsTable;
