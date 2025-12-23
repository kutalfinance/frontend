import { useState } from "react";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

import { type Transaction, TransactionTypes } from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

export function TransactionsTable({
  transactions,
  isLoading,
}: {
  transactions: Transaction[];
  isLoading: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: transactions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <DataTable table={table} isLoading={isLoading} />
      <DataTablePagination table={table} />
    </div>
  );
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium whitespace-nowrap">{formatMoney(row.original.amount)}</span>
    ),
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
    /* cell: ({ row }) => (
      <Link
        className="link"
        to={href("/admin/customers/:customerId", { customerId: row.original.customer.id })}
      >
        {row.original.customer.name}
      </Link>
    ), */
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) =>
      row.original.type === TransactionTypes.DEPOSIT ? (
        <Badge>
          <BanknoteArrowUp />
          {row.original.type}
        </Badge>
      ) : (
        <Badge variant="destructive">
          <BanknoteArrowDown />
          {row.original.type}
        </Badge>
      ),
  },
  {
    accessorKey: "recordedBy.name",
    header: "Recorded By",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.recordedBy.name}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <span className="text-muted-foreground whitespace-nowrap">
          {format(date, "MMM dd, yyyy 'at' h:mm a")}
        </span>
      );
    },
  },
];
