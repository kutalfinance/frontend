import { useState } from "react";
import { Link } from "react-router";

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

import { DataTable } from "@/components/ui/data-table";

import type { Customer } from "@/lib/types";

export function CustomersTable({
  customers,
  isLoading,
}: {
  customers: Customer[];
  isLoading: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: customers,
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
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
  });

  return <DataTable table={table} isLoading={isLoading} />;
}

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        to={`/admin/customers/${row.original.id}`}
        className="text-primary font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "branch.name",
    header: "Branch",
    cell: ({ row }) => row.original.branch.name,
    // cell: ({ row }) => (
    //   <Link to={href(`/branches/${row.original.branch.id}`)}>{row.original.branch.name}</Link>
    // ),
  },
  {
    accessorKey: "nextOfKin.name",
    header: "Next of Kin",
    cell: ({ row }) => {
      const nextOfKin = row.original.nextOfKin;
      return nextOfKin.name || "Not provided";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <span className="text-muted-foreground">{format(date, "dd/MM/yyyy - h:mm a")}</span>;
    },
  },
];
