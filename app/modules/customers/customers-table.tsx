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
import { ArrowRightLeft, Download, Eye, Pencil, Trash2 } from "lucide-react";

import { AdminOnly } from "@/components/protected";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Label } from "@/components/ui/label";
import { Paragraph } from "@/components/ui/text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useBranchesAdmin } from "@/hooks/data/branches";
import { useDeleteCustomers, useMoveCustomers } from "@/hooks/data/customers";
import type { Customer } from "@/lib/types";
import { formatMoney } from "@/lib/utils/money";

import { EditCustomer } from "./customer-edit";
import { ViewCustomer } from "./customer-view";
import { DownloadStatement } from "./download-statement";

function DeleteCustomersDialog({
  ids,
  open,
  onOpenChange,
}: {
  ids: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: deleteCustomers, isPending } = useDeleteCustomers();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {ids.length} customer(s)?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the selected customer(s) and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => deleteCustomers(ids, { onSuccess: () => onOpenChange(false) })}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function MoveCustomersDialog({
  ids,
  open,
  onOpenChange,
}: {
  ids: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [targetBranchId, setTargetBranchId] = useState("");
  const { data: branchesRes } = useBranchesAdmin();
  const branches = branchesRes?.data ?? [];
  const { mutate: moveCustomers, isPending } = useMoveCustomers();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Move {ids.length} customer(s)</AlertDialogTitle>
          <AlertDialogDescription>
            Select the branch to move the selected customer(s) to.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="px-1 pb-2">
          <Label className="mb-1.5 block">Target branch</Label>
          <Select value={targetBranchId} onValueChange={setTargetBranchId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name} — {b.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending || !targetBranchId}
            onClick={() =>
              moveCustomers(
                { ids, targetBranchId },
                { onSuccess: () => onOpenChange(false) }
              )
            }
          >
            Move Customers
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 7 });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [moveDialog, setMoveDialog] = useState(false);

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
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((r) => r.original.id);

  return (
    <div className="space-y-4">
      <AdminOnly>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">{selectedIds.length} selected</span>
            <div className="ml-auto flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMoveDialog(true)}
              >
                <ArrowRightLeft className="mr-1 size-3.5" />
                Move
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setDeleteDialog(true)}
              >
                <Trash2 className="mr-1 size-3.5" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </AdminOnly>

      <DataTable table={table} isLoading={isLoading} />
      <DataTablePagination table={table} />

      <DeleteCustomersDialog
        ids={selectedIds}
        open={deleteDialog}
        onOpenChange={(open) => {
          setDeleteDialog(open);
          if (!open) table.resetRowSelection();
        }}
      />
      <MoveCustomersDialog
        ids={selectedIds}
        open={moveDialog}
        onOpenChange={(open) => {
          setMoveDialog(open);
          if (!open) table.resetRowSelection();
        }}
      />
    </div>
  );
}

const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
