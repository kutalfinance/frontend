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

import { useDebounce } from "@/hooks/use-debounce";
import { useCustomers } from "@/hooks/data/customers";
import { ContributionTypes } from "@/lib/types";

// Context
interface ContributionFiltersContextValue {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => void;
  disabled?: boolean;
  hasFilters: boolean;
}

const ContributionFiltersContext = createContext<ContributionFiltersContextValue | null>(null);

function useContributionFilters() {
  const context = useContext(ContributionFiltersContext);
  if (!context) {
    throw new Error("Contribution filter components must be used within ContributionFilters");
  }
  return context;
}

// Main container component
export function ContributionFilters({
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
    <ContributionFiltersContext.Provider
      value={{ searchParams, setSearchParams, disabled, hasFilters }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">{children}</div>
    </ContributionFiltersContext.Provider>
  );
}

// Individual filter components
export function ContributionSearchFilter() {
  const { searchParams, setSearchParams, disabled } = useContributionFilters();

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
        placeholder="Search contributions..."
        type="search"
        className="w-full pl-9"
        defaultValue={searchParams.get("q") || ""}
        onChange={debouncedSearch}
        disabled={disabled}
      />
    </div>
  );
}

export function ContributionTypeFilter() {
  const { searchParams, setSearchParams, disabled } = useContributionFilters();

  return (
    <Tabs
      value={searchParams.get("contributionType") || "all"}
      onValueChange={(value) => {
        setSearchParams((prev) => {
          if (value === "all") value = "";

          if (value) prev.set("contributionType", value);
          else prev.delete("contributionType");
          return prev;
        });
      }}
    >
      <TabsList>
        <TabsTrigger disabled={disabled} value="all">
          All types
        </TabsTrigger>

        <TabsTrigger disabled={disabled} value={ContributionTypes.DEPOSIT}>
          Deposits
        </TabsTrigger>

        <TabsTrigger disabled={disabled} value={ContributionTypes.WITHDRAWAL}>
          Withdrawals
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export function ContributionCustomerFilter() {
  const { searchParams, setSearchParams, disabled } = useContributionFilters();
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

export function ContributionSortFilter() {
  const { searchParams, setSearchParams, disabled } = useContributionFilters();

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
        <SelectItem value="contributionType">Type</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function ContributionClearFilters() {
  const { hasFilters, setSearchParams } = useContributionFilters();

  if (!hasFilters) return null;

  return (
    <Button
      variant="link"
      onClick={() =>
        setSearchParams((prev) => {
          prev.delete("contributionType");
          prev.delete("customerId");
          return prev;
        })
      }
    >
      Clear filters
    </Button>
  );
}
