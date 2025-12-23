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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCustomers } from "@/hooks/data/customers";
import { useDebounce } from "@/hooks/use-debounce";
import { TransactionTypes } from "@/lib/types";

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
    throw new Error("Transaction filter components must be used within TransactionFilters");
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
    <Tabs
      value={searchParams.get("transactionType") || "all"}
      onValueChange={(value) => {
        setSearchParams((prev) => {
          if (value === "all") value = "";

          if (value) prev.set("transactionType", value);
          else prev.delete("transactionType");
          return prev;
        });
      }}
    >
      <TabsList>
        <TabsTrigger disabled={disabled} value="all">
          All types
        </TabsTrigger>

        <TabsTrigger disabled={disabled} value={TransactionTypes.DEPOSIT}>
          Deposits
        </TabsTrigger>

        <TabsTrigger disabled={disabled} value={TransactionTypes.WITHDRAWAL}>
          Withdrawals
        </TabsTrigger>
      </TabsList>
    </Tabs>
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
        <SelectItem value="transactionType">Type</SelectItem>
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
          prev.delete("transactionType");
          prev.delete("customerId");
          return prev;
        })
      }
    >
      Clear filters
    </Button>
  );
}
