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
import NextImage from "@components/common/NextImage";
import { useAccount } from "wagmi";

interface PropsType<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
}

const TradeHistoryTable = <TData, TValue>({
  columns,
  data,
  isLoading
}: PropsType<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  const { isConnected } = useAccount();

  return (
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
      <TableBody className="font-normal text-sm/4 max-h-64 overflow-y-auto">
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
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-36 text-center">
              <div className="flex flex-col gap-2">
                <NextImage
                  src="/icons/file-icon.svg"
                  className="size-[62px]"
                  altText="file icon"
                />
                <span className="text-[#B0B3B8] font-normal text-sm/6">
                  {isLoading ? "Fetching your Positions..." : "No Close Positions."}
                </span>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TradeHistoryTable;
