import { useState } from "react";
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

import { useDebounce } from "@/hooks/use-debounce";

const auditActions = [
  "LOGIN",
  "LOGOUT",
  "PASSWORD_SET",
  "PASSWORD_RESET",
  "ADMIN_CREATED",
  "ADMIN_UPDATED",
  "ADMIN_DELETED",
  "AGENT_CREATED",
  "AGENT_UPDATED",
  "AGENT_DELETED",
  "USER_ROLE_CHANGED",
  "CUSTOMER_CREATED",
  "CUSTOMER_UPDATED",
  "CUSTOMER_DELETED",
  "CUSTOMER_VIEWED",
  "TRANSACTION_DELETED",
  "TRANSACTION_DEPOSIT",
  "TRANSACTION_WITHDRAWAL_APPROVED",
  "TRANSACTION_WITHDRAWAL_REJECTED",
  "TRANSACTION_WITHDRAWAL_REQUEST",
  "BRANCH_CREATED",
  "BRANCH_UPDATED",
  "BRANCH_DELETED",
  "BRANCH_VIEWED",
  "DATA_EXPORTED",
  "DATA_IMPORTED",
  "BULK_DEACTIVATE",
  "BULK_REACTIVATE",
  "BULK_DELETE",
  "SERVICE_CHARGE",
  "UPDATE",
  "DELETE",
  "DEACTIVATE",
  "REACTIVATE",
] as const;

const entityTypes = [
  "ADMIN",
  "AGENT",
  "BRANCH",
  "CUSTOMER",
  "TRANSACTION",
  "USER",
  "SYSTEM",
] as const;

export function AuditFilters({ disabled }: { disabled?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const hasFilters = Array.from(searchParams.keys()).some(
    (key) => !["q", "sortBy", "sortDirection"].includes(key)
  );

  const debouncedSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      if (e.target.value) prev.set("q", e.target.value);
      else prev.delete("q");
      return prev;
    });
  });

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative w-full md:max-w-xs">
        <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search audit logs..."
          type="search"
          className="w-full pl-9"
          defaultValue={searchParams.get("q") || ""}
          onChange={debouncedSearch}
          disabled={disabled}
        />
      </div>

      <Select
        disabled={disabled}
        value={searchParams.get("action") || "all"}
        onValueChange={(value) => {
          setSearchParams((prev) => {
            if (value === "all") prev.delete("action");
            else prev.set("action", value);
            return prev;
          });
        }}
      >
        <SelectTrigger>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Action:</span>
            <SelectValue placeholder="Action" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All actions</SelectItem>
          {auditActions.map((action) => (
            <SelectItem key={action} value={action}>
              {action}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        disabled={disabled}
        value={searchParams.get("entityType") || "all"}
        onValueChange={(value) => {
          setSearchParams((prev) => {
            if (value === "all") prev.delete("entityType");
            else prev.set("entityType", value);
            return prev;
          });
        }}
      >
        <SelectTrigger>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Entity:</span>
            <SelectValue placeholder="Entity" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All entities</SelectItem>
          {entityTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AuditDateRangeFilter disabled={disabled} />

      {hasFilters && (
        <Button
          variant="link"
          onClick={() =>
            setSearchParams((prev) => {
              prev.delete("action");
              prev.delete("entityType");
              prev.delete("loggedAfter");
              prev.delete("loggedBefore");
              return prev;
            })
          }
        >
          Clear filters
        </Button>
      )}

      <div className="ml-auto flex items-center gap-1">
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
            <SelectItem value="timestamp">Time</SelectItem>
            <SelectItem value="authorName">User</SelectItem>
            <SelectItem value="action">Action</SelectItem>
            <SelectItem value="entityType">Entity Type</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function AuditDateRangeFilter({ disabled }: { disabled?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const loggedAfter = searchParams.get("loggedAfter") || "";
  const loggedBefore = searchParams.get("loggedBefore") || "";

  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(loggedAfter);
  const [to, setTo] = useState(loggedBefore);

  const hasDateFilter = loggedAfter || loggedBefore;

  function applyDates() {
    setSearchParams((prev) => {
      if (from) prev.set("loggedAfter", from);
      else prev.delete("loggedAfter");
      if (to) prev.set("loggedBefore", to);
      else prev.delete("loggedBefore");
      return prev;
    });
    setOpen(false);
  }

  function clearDates() {
    setFrom("");
    setTo("");
    setSearchParams((prev) => {
      prev.delete("loggedAfter");
      prev.delete("loggedBefore");
      return prev;
    });
    setOpen(false);
  }

  const displayText = (() => {
    if (loggedAfter && loggedBefore)
      return `${format(new Date(loggedAfter), "MMM dd, yyyy")} - ${format(new Date(loggedBefore), "MMM dd, yyyy")}`;
    if (loggedAfter) return `From ${format(new Date(loggedAfter), "MMM dd, yyyy")}`;
    if (loggedBefore) return `Until ${format(new Date(loggedBefore), "MMM dd, yyyy")}`;
    return "Date range";
  })();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={hasDateFilter ? "secondary" : "outline"} size="sm" disabled={disabled}>
          <CalendarIcon className="size-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-4">
        <div className="space-y-2">
          <Label>From</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} max={to} />
        </div>
        <div className="space-y-2">
          <Label>To</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} min={from} />
        </div>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={clearDates}>
            Clear
          </Button>
          <Button size="sm" onClick={applyDates}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
