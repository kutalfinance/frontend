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
import { Plus, SquarePen, Trash2, XIcon } from "lucide-react";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Paragraph } from "@/components/ui/text";

import { useUsers, validateUserSearch } from "@/hooks/data/users";
import { type User } from "@/lib/types";
import { DeactivateUser } from "@/modules/users/delete-user";
import { EditUser } from "@/modules/users/edit-user";
import { UserFilters } from "@/modules/users/filters";

import type { Route } from "./+types/users";

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateUserSearch.parse(params);
    return { searchParams: validatedParams };
  } catch {
    return { searchParams: {} };
  }
}

export default function Users({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;

  const { data, isPending } = useUsers({ searchParams });
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
      pagination: { pageIndex: 0, pageSize: 20 },
    },
  });

  const selectedUsers = table.getSelectedRowModel().flatRows.map((row) => row.original);

  return (
    <div>
      <Outlet />

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>User Management</ModuleTitle>
          <ModuleActions>
            <Button asChild>
              <Link to="/admin/users/create">
                <Plus /> Create user
              </Link>
            </Button>
          </ModuleActions>
        </ModuleHeader>
        <ModuleDescription>
          Manage admin and agent accounts. Create new users, view their status, and control access
          permissions.
        </ModuleDescription>
      </ModuleHeading>

      <UserFilters disabled={isPending} />

      <DataTable table={table} isLoading={isPending} />

      {!!selectedUsers.length && (
        <div
          data-state={!!selectedUsers.length ? "open" : "closed"}
          className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed bottom-[5%] left-[50%] z-50 flex w-fit max-w-[calc(100%-2rem)] translate-x-[-50%] items-center gap-2 rounded-lg border px-4 shadow-lg duration-200 sm:max-w-lg"
        >
          <Paragraph className="text-muted-foreground py-4">
            {selectedUsers.length} users selected
          </Paragraph>
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-6" />
          <DeactivateUser users={selectedUsers}>
            <Button variant="destructive-outline">Delete</Button>
          </DeactivateUser>
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-6" />
          <Button onClick={() => table.resetRowSelection()} variant="ghost" size="icon">
            <XIcon className="size-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium whitespace-nowrap">{row.original.name}</span>,
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
      if (row.original.isSuperAdmin) {
        return (
          <Badge className="whitespace-nowrap" variant="destructive">
            SUPER ADMIN
          </Badge>
        );
      }

      return <Badge variant={role === "ADMIN" ? "default" : "accent"}>{role}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <span className="text-muted-foreground">{format(date, "dd/MM/yyyy - h:mm a")}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <EditUser user={row.original}>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Edit</span>
              <SquarePen className="text-muted-foreground" />
            </Button>
          </EditUser>

          <DeactivateUser users={[row.original]}>
            <Button variant="destructive-outline" size="icon">
              <span className="sr-only">Delete</span>
              <Trash2 />
            </Button>
          </DeactivateUser>
        </div>
      );
    },
  },
];
