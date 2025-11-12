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

import { type Contribution, ContributionTypes } from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

export function ContributionsTable({
  contributions,
  isLoading,
}: {
  contributions: Contribution[];
  isLoading: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: contributions,
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

const columns: ColumnDef<Contribution>[] = [
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
    accessorKey: "contributionType",
    header: "Type",
    cell: ({ row }) =>
      row.original.contributionType === ContributionTypes.DEPOSIT ? (
        <Badge>
          <BanknoteArrowUp />
          {row.original.contributionType}
        </Badge>
      ) : (
        <Badge variant="destructive">
          <BanknoteArrowDown />
          {row.original.contributionType}
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
    accessorKey: "timestamp",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = new Date(row.original.timestamp);
      return (
        <span className="text-muted-foreground whitespace-nowrap">
          {format(date, "MMM dd, yyyy 'at' h:mm a")}
        </span>
      );
    },
  },
];
