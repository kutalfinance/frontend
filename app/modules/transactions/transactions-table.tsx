import { useState } from "react";
import { Link, href } from "react-router";

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

import { type Transaction, TransactionStatus, TransactionTypes } from "@/lib/types";
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
    cell: ({ row }) => (
      <Link className="link" to={href("/admin/customers") + `?q=${row.original.customer.name}`}>
        {row.original.customer.name}
      </Link>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      if (type === TransactionTypes.DEPOSIT) {
        return (
          <Badge>
            <BanknoteArrowUp />
            {type}
          </Badge>
        );
      } else if (type === TransactionTypes.WITHDRAWAL) {
        return (
          <Badge variant="destructive">
            <BanknoteArrowDown />
            {type}
          </Badge>
        );
      } else {
        return <Badge variant="outline">{type}</Badge>;
      }
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variantMap: Record<
        TransactionStatus,
        "default" | "secondary" | "destructive" | "outline"
      > = {
        [TransactionStatus.COMPLETED]: "default",
        [TransactionStatus.PENDING]: "secondary",
        [TransactionStatus.REJECTED]: "destructive",
        [TransactionStatus.FAILED]: "destructive",
      };
      return <Badge variant={variantMap[status]}>{status}</Badge>;
    },
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
