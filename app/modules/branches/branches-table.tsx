import { useState } from "react";
import { Link, href } from "react-router";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { PowerOff, SquarePen, Trash2 } from "lucide-react";

import { AdminOnly } from "@/components/protected";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { Branch } from "@/lib/types";
import { BranchActionDialog } from "@/modules/branches/branch-actions";
import { EditBranchAdmin } from "@/modules/branches/edit-branch-admin";

export function BranchesTable({ branches, isLoading }: { branches: Branch[]; isLoading: boolean }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 7 });

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
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="space-y-4">
      <DataTable table={table} isLoading={isLoading} />
      <DataTablePagination table={table} />
    </div>
  );
}

function BranchRowActions({ branch }: { branch: Branch }) {
  const [dialog, setDialog] = useState<"disable" | "delete" | null>(null);

  return (
    <>
      <div className="flex gap-2">
        <EditBranchAdmin asChild branch={branch}>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Edit</span>
            <SquarePen />
          </Button>
        </EditBranchAdmin>

        <AdminOnly>
          <Button variant="ghost" size="icon" onClick={() => setDialog("disable")}>
            <span className="sr-only">Disable</span>
            <PowerOff className="text-amber-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDialog("delete")}>
            <span className="sr-only">Delete</span>
            <Trash2 className="text-destructive" />
          </Button>
        </AdminOnly>
      </div>

      {dialog && (
        <BranchActionDialog
          branch={branch}
          mode={dialog}
          open={!!dialog}
          onOpenChange={(open) => !open && setDialog(null)}
        />
      )}
    </>
  );
}

const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: "name",
    header: "Branch Name",
    cell: ({ row }) => (
      <Link
        to={href("/admin/customers") + `?branchId=${row.original.id}`}
        className="text-primary font-medium whitespace-nowrap hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.location}</span>,
    meta: { className: "min-w-48" },
  },
  {
    accessorKey: "agent.name",
    header: "Assigned Agent",
    cell: ({ row }) => row.original.agent?.name ?? <span className="text-muted-foreground">—</span>,
  },
  {
    id: "approvers",
    header: "Approvers",
    cell: ({ row }) => {
      const approvers = row.original.approvers ?? [];
      if (approvers.length === 0) return "-";
      if (approvers.length === 1) return approvers[0].name;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default underline decoration-dotted">
                {approvers.length} approvers
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1">
              {approvers.map((a) => (
                <span key={a.id}>{a.name}</span>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
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
    cell: ({ row }) => <BranchRowActions branch={row.original} />,
  },
];
