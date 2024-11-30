import ConnectWallet from "@components/common/ConnectWallet";
import { Button } from "@components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@components/ui/table";
import { PoolInfo, Tx } from "@squaredlab-io/sdk";
import { useModalStore } from "@store/poolsStore";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

interface PropsType<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pool: PoolInfo | undefined;
  loading: boolean;
}

const TransactionsTable = <TData, TValue>({
  columns,
  data,
  pool,
  loading
}: PropsType<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  const { setOpenCreateModal } = useModalStore();

  const router = useRouter();
  const { isConnected } = useAccount();

  return (
    <Table>
      <TableHeader className="font-sans-ibm-plex pt-6">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="font-bold text-sm/[18px] text-[#5F7183]"
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
      <TableBody className="divide-y divide-[#292B31]">
        {!isConnected ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-72 text-center w-full">
              <div className="flex flex-col items-center w-full text-center gap-5">
                <span className="font-normal text-base/7 text-[#B5B5B5]">
                  Connect Wallet to view your transactions.
                </span>
                <ConnectWallet />
              </div>
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const { hash } = row.original as Tx;
            return (
              <TableRow
                key={row.id}
                className="hover:bg-[#19242C] transition-colors duration-200 cursor-pointer"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.open(
                      `https://sepolia.basescan.org/tx/${hash}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-72 text-center">
              {loading ? (
                <span>loading transactions...</span>
              ) : (
                <div className="flex flex-col items-center mx-auto gap-4">
                  <p className="font-sans-manrope font-normal text-base/7 text-[#B5B5B5] max-w-[335px]">
                    You have no transactions yet—start by creating a pool or by adding
                    liquidity to one
                  </p>
                  <div className="inline-flex items-center gap-3">
                    <Link
                      href={
                        pool ? `/pool/${pool.underlying}?power=${pool.power}` : "/pool"
                      }
                    >
                      <Button variant="default" size="lg">
                        Add Liquidity
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setOpenCreateModal(true)}
                    >
                      Create Pool
                    </Button>
                  </div>
                </div>
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
