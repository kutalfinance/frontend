import { createContext, useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { format } from "date-fns";
import { ArrowUpDown, CalendarIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCustomers } from "@/hooks/data/customers";
import { useDebounce } from "@/hooks/use-debounce";
import { TransactionStatus, TransactionTypes } from "@/lib/types";
import { cn } from "@/lib/utils";

// Context
interface TransactionFiltersContextValue {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => void;
  disabled?: boolean;
  hasFilters: boolean;
}

const TransactionFiltersContext = createContext<TransactionFiltersContextValue | null>(null);

function useTransactionFilters() {
  const context = useContext(TransactionFiltersContext);
  if (!context) {
    throw new Error(`${useTransactionFilters.name} must be used within ${TransactionFilters.name}`);
  }
  return context;
}

// Main container component
export function TransactionFilters({
  children,
  disabled,
  className,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const hasFilters = useMemo(
    () =>
      Array.from(searchParams.keys()).some(
        (key) => !["q", "sortBy", "sortDirection"].includes(key)
      ),
    [searchParams]
  );

  return (
    <TransactionFiltersContext.Provider
      value={{ searchParams, setSearchParams, disabled, hasFilters }}
    >
      <div className={className ?? "mb-4 flex flex-wrap items-center gap-2"}>{children}</div>
    </TransactionFiltersContext.Provider>
  );
}

// Individual filter components
export function TransactionSearchFilter({ className }: { className?: string }) {
  const { searchParams, setSearchParams, disabled } = useTransactionFilters();

  const debouncedSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      if (e.target.value) prev.set("q", e.target.value);
      else prev.delete("q");
      return prev;
    });
  });

  return (
    <div className={cn("relative w-full md:max-w-xs", className)}>
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        placeholder="Search transactions..."
        type="search"
        className="w-full pl-9"
        defaultValue={searchParams.get("q") || ""}
        onChange={debouncedSearch}
        disabled={disabled}
      />
    </div>
  );
}

export function TransactionTypeFilter() {
  const { searchParams, setSearchParams, disabled } = useTransactionFilters();

  return (
    <Select
      disabled={disabled}
      value={searchParams.get("type") || "all"}
      onValueChange={(value) => {
        setSearchParams((prev) => {
          if (value === "all") value = "";

          if (value) prev.set("type", value);
          else prev.delete("type");
          return prev;
        });
      }}
    >
      <SelectTrigger>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Type:</span>
          <SelectValue placeholder="Type" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All types</SelectItem>
        <SelectItem value={TransactionTypes.DEPOSIT}>Deposit</SelectItem>
        <SelectItem value={TransactionTypes.WITHDRAWAL}>Withdrawal</SelectItem>
        <SelectItem value={TransactionTypes.SERVICE_CHARGE}>Service Charge</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function TransactionCustomerFilter() {
  const { searchParams, setSearchParams, disabled } = useTransactionFilters();
  const { data: customersData } = useCustomers();
  const customers = customersData?.data ?? [];

  return (
    <Select
      disabled={disabled}
      value={searchParams.get("customerId") || "all"}
      onValueChange={(value) => {
        setSearchParams((prev) => {
          if (value === "all") value = "";

          if (value) prev.set("customerId", value);
          else prev.delete("customerId");
          return prev;
        });
      }}
    >
      <SelectTrigger>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Customer:</span>
          <SelectValue placeholder="Customer" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All customers</SelectItem>
        {customers.map((customer) => (
          <SelectItem key={customer.id} value={customer.id}>
            {customer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function TransactionStatusFilter() {
  const { searchParams, setSearchParams, disabled } = useTransactionFilters();

  return (
    <Select
      disabled={disabled}
      value={searchParams.get("status") || "all"}
      onValueChange={(value) => {
        setSearchParams((prev) => {
          if (value === "all") value = "";

          if (value) prev.set("status", value);
          else prev.delete("status");
          return prev;
        });
      }}
    >
      <SelectTrigger>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Status:</span>
          <SelectValue placeholder="Status" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value={TransactionStatus.COMPLETED}>Completed</SelectItem>
        <SelectItem value={TransactionStatus.PENDING}>Pending</SelectItem>
        <SelectItem value={TransactionStatus.REJECTED}>Rejected</SelectItem>
        <SelectItem value={TransactionStatus.FAILED}>Failed</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function TransactionSortFilter({ className }: { className?: string }) {
  const { searchParams, setSearchParams, disabled } = useTransactionFilters();

  return (
    <div className={cn("ml-auto flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        disabled={disabled}
        onClick={() => {
          setSearchParams((prev) => {
            const current = prev.get("sortDirection") || "desc";
            prev.set("sortDirection", current === "asc" ? "desc" : "asc");
            return prev;
          });
        }}
        title={
          (searchParams.get("sortDirection") || "desc") === "asc" ? "Ascending" : "Descending"
        }
      >
        <ArrowUpDown className="size-4" />
      </Button>

      <Select
        disabled={disabled}
        value={searchParams.get("sortBy") || "timestamp"}
        onValueChange={(value) => {
          setSearchParams((prev) => {
            if (value) {
              prev.set("sortBy", value);
              prev.set("sortDirection", value === "timestamp" ? "desc" : "asc");
            } else {
              prev.delete("sortBy");
              prev.delete("sortDirection");
            }
            return prev;
          });
        }}
      >
        <SelectTrigger className="w-44">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Sort by:</span>
            <SelectValue placeholder="Sort By" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="timestamp">Date</SelectItem>
          <SelectItem value="amount">Amount</SelectItem>
          <SelectItem value="type">Type</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function TransactionDateRangeFilter() {
  const { searchParams, setSearchParams, disabled } = useTransactionFilters();
  const [open, setOpen] = useState(false);

  const recordedAfter = searchParams.get("recordedAfter") || "";
  const recordedBefore = searchParams.get("recordedBefore") || "";

  const [fromDate, setFromDate] = useState(recordedAfter);
  const [toDate, setToDate] = useState(recordedBefore);

  const hasDateFilter = recordedAfter || recordedBefore;

  function formatDisplayDate(dateStr: string) {
    if (!dateStr) return "";
    return format(new Date(dateStr), "MMM dd, yyyy");
  }

  function getDisplayText() {
    if (recordedAfter && recordedBefore) {
      return `${formatDisplayDate(recordedAfter)} - ${formatDisplayDate(recordedBefore)}`;
    }
    if (recordedAfter) {
      return `From ${formatDisplayDate(recordedAfter)}`;
    }
    if (recordedBefore) {
      return `Until ${formatDisplayDate(recordedBefore)}`;
    }
    return "Date range";
  }

  function onApply() {
    setSearchParams((prev) => {
      if (fromDate) prev.set("recordedAfter", fromDate);
      else prev.delete("recordedAfter");

      if (toDate) prev.set("recordedBefore", toDate);
      else prev.delete("recordedBefore");

      return prev;
    });
    setOpen(false);
  }

  function onClear() {
    setFromDate("");
    setToDate("");
    setSearchParams((prev) => {
      prev.delete("recordedAfter");
      prev.delete("recordedBefore");
      return prev;
    });
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={hasDateFilter ? "secondary" : "outline"} disabled={disabled}>
          <CalendarIcon className="size-4" />
          <span className="max-w-40 truncate">{getDisplayText()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-4" align="start">
        <div className="space-y-2">
          <Label htmlFor="fromDate">From</Label>
          <Input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate || new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="toDate">To</Label>
          <Input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate || undefined}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
          <Button size="sm" onClick={onApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function TransactionClearFilters() {
  const { hasFilters, setSearchParams } = useTransactionFilters();

  if (!hasFilters) return null;

  return (
    <Button
      variant="link"
      onClick={() =>
        setSearchParams((prev) => {
          prev.delete("type");
          prev.delete("status");
          prev.delete("customerId");
          prev.delete("recordedAfter");
          prev.delete("recordedBefore");
          return prev;
        })
      }
    >
      Clear filters
    </Button>
  );
}
