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
import { SquarePen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";

import type { Branch } from "@/lib/types";
import { DeleteBranch } from "@/modules/branches/branch-actions";
import { EditBranch } from "@/modules/branches/edit-branch";

export function BranchesTable({ branches, isLoading }: { branches: Branch[]; isLoading: boolean }) {
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

  return <DataTable table={table} isLoading={isLoading} />;
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
    meta: { className: "min-w-48" },
  },
  {
    accessorKey: "agent",
    header: "Assigned Agent",
    cell: ({ row }) => row.original.agent.name,
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
          <EditBranch asChild branch={row.original}>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Edit</span>
              <SquarePen />
            </Button>
          </EditBranch>

          <DeleteBranch asChild branch={row.original}>
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
