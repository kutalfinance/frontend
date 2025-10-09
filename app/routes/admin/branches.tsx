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
import { SquarePen, Trash2 } from "lucide-react";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";

import { useBranches, validateBranchSearch } from "@/hooks/data/branches";
import type { Branch } from "@/lib/types";
import { DeleteBranch } from "@/modules/branches/delete-branch";
import { EditBranch } from "@/modules/branches/edit-branch";
import { BranchFilters } from "@/modules/branches/filters";

import type { Route } from "./+types/branches";

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateBranchSearch.parse(params);
    return { searchParams: validatedParams };
  } catch {
    return { searchParams: {} };
  }
}

export default function Branches({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;

  const { data, isPending } = useBranches({ searchParams });

  const branches = data?.data ?? [];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: branches,
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
          <ModuleTitle>Branch Management</ModuleTitle>
          <ModuleActions>
            <Button asChild>
              <Link to="/admin/branches/create">Create New Branch</Link>
            </Button>
          </ModuleActions>
        </ModuleHeader>
        <ModuleDescription>
          Manage branch locations and agent assignments. Create new branches, assign agents, and
          track branch performance.
        </ModuleDescription>
      </ModuleHeading>

      <BranchFilters disabled={isPending} />

      <DataTable table={table} isLoading={isPending} />
    </div>
  );
}

const columns: ColumnDef<Branch>[] = [
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
    header: "Branch Name",
    cell: ({ row }) => <span className="font-medium whitespace-nowrap">{row.original.name}</span>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.location}</span>,
  },
  {
    accessorKey: "agent",
    header: "Assigned Agent",
    cell: ({ row }) => row.original.agent,
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
          <EditBranch branch={row.original}>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Edit</span>
              <SquarePen />
            </Button>
          </EditBranch>

          <DeleteBranch branch={row.original}>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Delete</span>
              <Trash2 className="text-destructive" />
            </Button>
          </DeleteBranch>
        </div>
      );
    },
  },
];
