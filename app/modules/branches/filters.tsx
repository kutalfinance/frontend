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

import { useUsers } from "@/hooks/data/users";
import { useDebounce } from "@/hooks/use-debounce";
import { UserRoles } from "@/lib/types";

// Context for sharing filter state
type BranchFiltersContextValue = {
  searchParams: URLSearchParams;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
  disabled?: boolean;
  hasFilters: boolean;
};

const BranchFiltersContext = createContext<BranchFiltersContextValue | null>(null);

function useBranchFiltersContext() {
  const context = useContext(BranchFiltersContext);
  if (!context) {
    throw new Error("Branch filter components must be used within BranchFiltersProvider");
  }
  return context;
}

// Provider component
export function BranchFilters({
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
    <BranchFiltersContext.Provider value={{ searchParams, setSearchParams, disabled, hasFilters }}>
      <div className="mb-4 flex flex-wrap items-center gap-2">{children}</div>
    </BranchFiltersContext.Provider>
  );
}

// Individual filter components
export function BranchSearchFilter() {
  const { searchParams, setSearchParams } = useBranchFiltersContext();

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
        placeholder="Search branches..."
        type="search"
        className="w-full pl-9"
        defaultValue={searchParams.get("q") || ""}
        onChange={debouncedSearch}
      />
    </div>
  );
}

export function BranchAgentFilter() {
  const { searchParams, setSearchParams, disabled } = useBranchFiltersContext();
  const { data: usersData } = useUsers({ searchParams: { role: UserRoles.AGENT } });
  const agents = usersData?.data ?? [];

  return (
    <Select
      disabled={disabled}
      value={searchParams.get("agentId") || "all"}
      onValueChange={(value) => {
        setSearchParams((prev) => {
          if (value === "all") value = "";

          if (value) prev.set("agentId", value);
          else prev.delete("agentId");
          return prev;
        });
      }}
    >
      <SelectTrigger>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Agent:</span>
          <SelectValue placeholder="Agent" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {agents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function BranchSortFilter() {
  const { searchParams, setSearchParams, disabled } = useBranchFiltersContext();

  return (
    <Select
      disabled={disabled}
      value={searchParams.get("sortBy") || "createdAt"}
      onValueChange={(value) => {
        setSearchParams((prev) => {
          if (value) prev.set("sortBy", value);
          else prev.delete("sortBy");
          return prev;
        });
      }}
    >
      <SelectTrigger className="ml-auto">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="size-4" />
            <span className="text-muted-foreground">Sort by:</span>
          </div>
          <SelectValue placeholder="Sort By" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="name">Name</SelectItem>
        <SelectItem value="location">Location</SelectItem>
        <SelectItem value="createdAt">Created At</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function BranchClearFilters() {
  const { hasFilters, setSearchParams } = useBranchFiltersContext();

  if (!hasFilters) return null;

  return (
    <Button
      variant="link"
      onClick={() =>
        setSearchParams((prev) => {
          prev.delete("agentId");
          prev.delete("location");
          return prev;
        })
      }
    >
      Clear filters
    </Button>
  );
}
