import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
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

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";

import { useUsers } from "@/hooks/data";
import type { User } from "@/lib/types";
import { CircleCheckBig, LoaderCircle } from "lucide-react";

export const Route = createFileRoute("/_main/u/users")({
  component: Users,
});

function Users() {
  const { data, isLoading } = useUsers();
  const users = data?.data ?? [];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: users,
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
    <div>
      <Outlet />

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>User Management</ModuleTitle>
          <ModuleActions>
            <Button asChild>
              <Link to="/u/users/create">Create New User</Link>
            </Button>
          </ModuleActions>
        </ModuleHeader>
        <ModuleDescription>
          Manage admin and agent accounts. Create new users, view their status, and control access
          permissions.
        </ModuleDescription>
      </ModuleHeading>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div></div>
          <Input placeholder="Filter by name or email..." className="w-full max-w-sm" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoaderCircle className="text-primary size-8 animate-spin" />
          </div>
        ) : (
          <DataTable table={table} />
        )}
      </div>
    </div>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return <Badge variant={role === "ADMIN" ? "default" : "secondary"}>{role}</Badge>;
    },
  },
  {
    accessorKey: "isSuperAdmin",
    header: () => <span className="block w-fit">Super Admin</span>,
    cell: ({ row }) => {
      return (
        <div className="">
          {row.original.isSuperAdmin ? (
            <CircleCheckBig className="text-success size-5" />
          ) : (
            <span className="text-muted-foreground ml-0.5">—</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <span className="text-muted-foreground">{date.toLocaleDateString()}</span>;
    },
  },
];
