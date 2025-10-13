import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { SquarePen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { Branch } from "@/lib/types";
import { DeleteBranch } from "@/modules/branches/branch-actions";
import { EditBranchAgent } from "@/modules/branches/edit-branch-agent";
import { Paragraph } from "@/components/ui/text";

export const agentBranchesColumns: ColumnDef<Branch>[] = [
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
    cell: ({ row }) => (
      <div>
        <Paragraph className="font-medium whitespace-nowrap">{row.original.name}</Paragraph>
        <Paragraph className="text-muted-foreground sm:hidden">{row.original.location}</Paragraph>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.location}</span>,
    meta: { className: "min-w-48 hidden sm:table-cell" },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <span className="text-muted-foreground">{format(date, "dd/MM/yyyy - h:mm a")}</span>;
    },
    meta: { className: "hidden sm:table-cell" },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <EditBranchAgent asChild branch={row.original}>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Edit</span>
              <SquarePen />
            </Button>
          </EditBranchAgent>

          <DeleteBranch asChild branch={row.original}>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Delete</span>
              <Trash2 className="text-destructive" />
            </Button>
          </DeleteBranch>
        </div>
      );
    },
    meta: { className: "w-28" },
  },
];
