import { useState } from "react";
import { Link, href } from "react-router";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type RowData,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { BanknoteArrowDown, BanknoteArrowUp, Undo2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

import { type Transaction, TransactionStatus, TransactionTypes } from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

import { ReverseTransaction } from "./transaction-reverse";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    isAgentView?: boolean;
  }
}

export function TransactionsTable({
  transactions,
  isLoading,
  isAgentView = false,
}: {
  transactions: Transaction[];
  isLoading: boolean;
  isAgentView?: boolean;
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
    initialState: { pagination: { pageIndex: 0, pageSize: 7 } },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      isAgentView,
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
    cell: ({ row, table }) =>
      table.options.meta?.isAgentView ? (
        row.original.customer.name
      ) : (
        <Link className="link" to={href("/admin/customers") + `?q=${row.original.customer.name}`}>
          {row.original.customer.name}
        </Link>
      ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const { type, isReversed } = row.original;
      if (type === TransactionTypes.DEPOSIT) {
        return (
          <div className="flex flex-col gap-1">
            <Badge variant={isReversed ? "outline" : "default"} className={isReversed ? "line-through opacity-60" : undefined}>
              <BanknoteArrowUp />
              {type}
            </Badge>
          </div>
        );
      } else if (type === TransactionTypes.WITHDRAWAL) {
        return (
          <div className="flex flex-col gap-1">
            <Badge variant={isReversed ? "outline" : "destructive"} className={isReversed ? "line-through opacity-60" : undefined}>
              <BanknoteArrowDown />
              {type}
            </Badge>
          </div>
        );
      } else if (type === TransactionTypes.REVERSAL) {
        return (
          <Badge variant="secondary">
            <Undo2 />
            REVERSAL
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
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      if (table.options.meta?.isAgentView) return null;
      const tx = row.original;
      const canReverse =
        tx.status === TransactionStatus.COMPLETED &&
        tx.type !== TransactionTypes.REVERSAL &&
        !tx.isReversed;
      if (!canReverse) return null;
      return (
        <ReverseTransaction transaction={tx}>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
            <Undo2 className="size-4" />
            Reverse
          </Button>
        </ReverseTransaction>
      );
    },
  },
];
