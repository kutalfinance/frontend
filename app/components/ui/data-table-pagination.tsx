import { type Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { Paragraph } from "./text";

type DataTablePaginationProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
  table: Table<TData>;
};

export function DataTablePagination<TData>({
  table,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)} {...props}>
      <Paragraph className="text-muted-foreground flex items-center justify-center text-sm">
        {!!table.getPageCount() && (
          <>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </>
        )}
      </Paragraph>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
