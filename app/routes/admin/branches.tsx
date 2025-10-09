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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useBranches } from "@/hooks/data/branches";
import { useUsers } from "@/hooks/data/users";
import type { Branch } from "@/lib/types";
import { UserRoles } from "@/lib/types";
import { DeleteBranch } from "@/modules/branches/delete-branch";
import { EditBranch } from "@/modules/branches/edit-branch";

export default function Branches() {
  const { data: usersData } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("all");

  // Use server-side filtering for agent, client-side for search
  const { data, isPending } = useBranches(
    selectedAgentId !== "all" ? { agentId: selectedAgentId } : {}
  );

  const branches = data?.data ?? [];
  const agents = usersData?.data?.filter((user) => user.role === UserRoles.AGENT) ?? [];

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

      <div className="space-y-4">
        <div className="container flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Filter by name or location..."
            className="w-full max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DataTable table={table} isLoading={isPending} />
      </div>
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
