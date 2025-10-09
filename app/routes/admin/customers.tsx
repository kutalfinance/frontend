import { useState } from "react";
import { Link, Outlet } from "react-router";

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

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";

import { useCustomers } from "@/hooks/data/customers";
import type { Customer } from "@/lib/types";

export default function Customers() {
  const { data, isPending } = useCustomers();
  const customers = data?.data ?? [];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: customers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    // getRowCanExpand: () => true,
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
    <div>
      <Outlet />

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Customer Management</ModuleTitle>
          <ModuleActions>
            <Button asChild>
              <Link to="/admin/customers/create">Create New Customer</Link>
            </Button>
          </ModuleActions>
        </ModuleHeader>
        <ModuleDescription>
          Manage customer accounts and information. Create new customers, view their details, and
          track customer interactions.
        </ModuleDescription>
      </ModuleHeading>

      <div className="space-y-4">
        <div className="container flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div></div>
          <Input placeholder="Filter by name or email..." className="w-full max-w-sm" />
        </div>

        <DataTable table={table} isLoading={isPending} />
      </div>
    </div>
  );
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
    accessorKey: "branchName",
    header: "Branch",
    cell: ({ row }) => row.original.branchName ?? "No Branch",
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
