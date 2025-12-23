import { createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router";

import { ArrowUpDown, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    throw new Error(
      `${useTransactionFilters.name} must be used within ${TransactionFilters.name}`
    );
  }
  return context;
}

// Main container component
export function TransactionFilters({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const hasFilters = useMemo(
    () => Array.from(searchParams.keys()).some((key) => !["q", "sortBy"].includes(key)),
    [searchParams]
  );

  return (
    <TransactionFiltersContext.Provider
      value={{ searchParams, setSearchParams, disabled, hasFilters }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">{children}</div>
    </TransactionFiltersContext.Provider>
  );
}

// Individual filter components
export function TransactionSearchFilter() {
  const { searchParams, setSearchParams, disabled } = useTransactionFilters();

  const debouncedSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      if (e.target.value) prev.set("q", e.target.value);
      else prev.delete("q");
      return prev;
    });
  });

  return (
    <div className="relative w-full md:max-w-xs">
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

export function TransactionSortFilter() {
  const { searchParams, setSearchParams, disabled } = useTransactionFilters();

  return (
    <Select
      disabled={disabled}
      value={searchParams.get("sortBy") || "timestamp"}
      onValueChange={(value) => {
        setSearchParams((prev) => {
          if (value) prev.set("sortBy", value);
          else prev.delete("sortBy");
          return prev;
        });
      }}
    >
      <SelectTrigger className="ml-auto w-48">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="size-4" />
            <span className="text-muted-foreground">Sort by:</span>
          </div>
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
          return prev;
        })
      }
    >
      Clear filters
    </Button>
  );
}
