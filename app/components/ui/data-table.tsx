import { type Table as TableType, flexRender } from "@tanstack/react-table";
import type { Row, RowData } from "@tanstack/react-table";
import { SearchX } from "lucide-react";

import { Loader } from "@/components/loader";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }

  interface TableMeta<TData extends RowData> {
    getRowClassName?: (row: Row<TData>) => string | undefined;
  }
}

export function DataTable<TData>({
  table,
  isLoading,
}: {
  table: TableType<TData>;
  isLoading?: boolean;
}) {
  const columns = table.getAllColumns();

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  className={cn(
                    "bg-muted whitespace-nowrap",
                    header.column.columnDef.meta?.className
                  )}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              <Loader />
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className={table.options.meta?.getRowClassName?.(row)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell className={cn("", cell.column.columnDef.meta?.className)} key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-40 text-center">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchX />
                  </EmptyMedia>
                  <EmptyTitle>No results found</EmptyTitle>
                  <EmptyDescription>
                    No results match your search criteria. Try adjusting your filters.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
