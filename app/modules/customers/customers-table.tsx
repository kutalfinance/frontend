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

import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Paragraph } from "@/components/ui/text";

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

  return (
    <div className="space-y-4">
      <DataTable table={table} isLoading={isLoading} />
      <DataTablePagination table={table} />
    </div>
  );
}

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        to={href("/admin/transactions") + `?customerId=${row.original.id}`}
        className="text-primary font-medium whitespace-nowrap hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div>
          <Paragraph>{customer.phoneNumber}</Paragraph>
          <Paragraph className="text-muted-foreground text-sm">{customer.email}</Paragraph>
        </div>
      );
    },
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
      return nextOfKin.name;
    },
  },
  {
    accessorKey: "nextOfKin.phoneNumber",
    header: "Next of Kin Contact",
    cell: ({ row }) => {
      const nextOfKin = row.original.nextOfKin;
      return (
        <div>
          <Paragraph>{nextOfKin.phoneNumber}</Paragraph>
          <Paragraph className="text-muted-foreground text-sm">{nextOfKin.email}</Paragraph>
        </div>
      );
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
