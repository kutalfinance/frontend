import { Link, href } from "react-router";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Paragraph } from "@/components/ui/text";

import type { Branch } from "@/lib/types";

export const agentBranchesColumns: ColumnDef<Branch>[] = [
  {
    accessorKey: "name",
    header: "Branch Name",
    cell: ({ row }) => (
      <Link className="link" to={href("/agent/branches/:branchId", { branchId: row.original.id })}>
        <Paragraph className="font-medium whitespace-nowrap">{row.original.name}</Paragraph>
        <Paragraph className="text-muted-foreground sm:hidden">{row.original.location}</Paragraph>
      </Link>
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
];
