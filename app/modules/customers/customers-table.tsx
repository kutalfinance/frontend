import { useState } from "react";
import { Link, href } from "react-router";

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
import { Download, Eye, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Paragraph } from "@/components/ui/text";

import type { Customer } from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

import { EditCustomer } from "./customer-edit";
import { ViewCustomer } from "./customer-view";
import { DownloadStatement } from "./download-statement";

export function CustomersTable({
  customers,
  isLoading,
}: {
  customers: Customer[];
  isLoading: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: customers,
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
    <div className="space-y-4">
      <DataTable table={table} isLoading={isLoading} />
      <DataTablePagination table={table} />
    </div>
  );
}

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        to={href("/admin") + `?customerId=${row.original.id}`}
        className="text-primary font-medium whitespace-nowrap hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "accountNumber",
    header: "Account Number",
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.accountNumber}</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div>
          <Paragraph>{customer.phoneNumber}</Paragraph>
          <Paragraph className="text-muted-foreground text-sm">{customer.email}</Paragraph>
        </div>
      );
    },
  },
  {
    accessorKey: "branch.name",
    header: "Branch",
    cell: ({ row }) => row.original.branch.name,
  },
  {
    accessorKey: "contributionAmount",
    header: "Contribution",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatMoney(row.original.contributionAmount)}</span>
    ),
  },
  {
    accessorKey: "registrationDate",
    header: "Registration Date",
    cell: ({ row }) => {
      const date = row.original.registrationDate ? new Date(row.original.registrationDate) : null;
      return date ? (
        <span className="text-muted-foreground whitespace-nowrap">
          {format(date, "dd/MM/yyyy")}
        </span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "lastDepositDate",
    header: "Last Deposit",
    cell: ({ row }) => {
      const date = row.original.lastDepositDate ? new Date(row.original.lastDepositDate) : null;
      return date ? (
        <span className="text-muted-foreground whitespace-nowrap">
          {format(date, "dd/MM/yyyy")}
        </span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <ViewCustomer customer={row.original}>
            <Button variant="ghost" size="sm">
              <Eye className="size-4" />
            </Button>
          </ViewCustomer>
          <EditCustomer customer={row.original}>
            <Button variant="ghost" size="sm">
              <Pencil className="size-4" />
            </Button>
          </EditCustomer>
          <DownloadStatement customer={row.original}>
            <Button variant="ghost" size="sm">
              <Download className="size-4" />
            </Button>
          </DownloadStatement>
        </div>
      );
    },
  },
];
