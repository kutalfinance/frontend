import { Link, href } from "react-router";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import type { Branch } from "@/lib/types";

export const agentBranchesColumns: ColumnDef<Branch>[] = [
  {
    accessorKey: "name",
    header: "Branch Name",
    cell: ({ row }) => (
      <Link
        className="link whitespace-nowrap"
        to={href("/agent/branches/:branchId", { branchId: row.original.id })}
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.location}</span>,
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
