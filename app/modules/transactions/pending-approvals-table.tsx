import { useMemo, useState } from "react";
import { Link, href } from "react-router";

import {
  type Column,
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
import { ArrowUpDown, ScanEye, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Transaction } from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

import { WithdrawalRequestSheet } from "./withdrawal-request-sheet";

export function PendingApprovalsTable({
  transactions,
  isLoading,
}: {
  transactions: Transaction[];
  isLoading: boolean;
}) {
  // oldest requests first so nothing lingers unreviewed
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const agents = useMemo(
    () => [...new Set(transactions.map((t) => t.recordedBy.name))].sort(),
    [transactions]
  );

  const table = useReactTable({
    data: transactions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue).toLowerCase();
      return (
        row.original.customer.name.toLowerCase().includes(q) ||
        row.original.recordedBy.name.toLowerCase().includes(q)
      );
    },
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
      globalFilter,
    },
  });

  const agentFilter = (table.getColumn("agent")?.getFilterValue() as string) ?? "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full md:max-w-xs">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search by customer or agent..."
            type="search"
            className="w-full pl-9"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Select
          disabled={isLoading}
          value={agentFilter}
          onValueChange={(value) => {
            table.getColumn("agent")?.setFilterValue(value === "all" ? undefined : value);
          }}
        >
          <SelectTrigger>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Agent:</span>
              <SelectValue placeholder="Agent" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All agents</SelectItem>
            {agents.map((agent) => (
              <SelectItem key={agent} value={agent}>
                {agent}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable table={table} isLoading={isLoading} />
      <DataTablePagination table={table} />
    </div>
  );
}

function SortableHeader({
  column,
  children,
}: {
  column: Column<Transaction, unknown>;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      <ArrowUpDown className="size-3.5" />
    </Button>
  );
}

const columns: ColumnDef<Transaction>[] = [
  {
    id: "customer",
    accessorFn: (row) => row.customer.name,
    header: ({ column }) => <SortableHeader column={column}>Customer</SortableHeader>,
    cell: ({ row }) => (
      <Link
        className="link font-medium whitespace-nowrap"
        to={href("/admin/customers") + `?q=${row.original.customer.name}`}
      >
        {row.original.customer.name}
      </Link>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <SortableHeader column={column}>Amount</SortableHeader>,
    cell: ({ row }) => (
      <span className="font-medium whitespace-nowrap">{formatMoney(row.original.amount)}</span>
    ),
  },
  {
    id: "agent",
    accessorFn: (row) => row.recordedBy.name,
    header: ({ column }) => <SortableHeader column={column}>Agent</SortableHeader>,
    cell: ({ row }) => <span>{row.original.recordedBy.name}</span>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column}>Requested</SortableHeader>,
    cell: ({ row }) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {format(new Date(row.original.createdAt), "MMM dd, yyyy 'at' h:mm a")}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => (
      <WithdrawalRequestSheet transaction={row.original}>
        <Button variant="outline" size="sm">
          <ScanEye className="size-4" />
          Review
        </Button>
      </WithdrawalRequestSheet>
    ),
  },
];
