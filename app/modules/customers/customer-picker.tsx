import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { customerByIdQueryOptions, pagedCustomersQueryOptions } from "@/hooks/data/customers";
import type { Customer } from "@/lib/types";
import { cn } from "@/lib/utils";

const RESULT_LIMIT = 20;

/** The selected customer, fetched by id (works for ids that come from the URL too). */
export function useSelectedCustomer(id: string | null | undefined) {
  const { data } = useQuery({ ...customerByIdQueryOptions(id ?? ""), enabled: !!id });
  return data?.data;
}

/**
 * Customer combobox that searches on the server, so it works no matter how
 * many customers exist. `children` is the trigger element.
 */
export function CustomerPicker({
  value,
  onSelect,
  children,
  allOption,
  disabled,
}: {
  value: string | null | undefined;
  onSelect: (customer: Customer | null) => void;
  children: React.ReactNode;
  /** Label for an extra "no customer" entry (e.g. "All customers"); selecting it passes null. */
  allOption?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isFetching } = useQuery({
    ...pagedCustomersQueryOptions({
      searchParams: debounced ? { q: debounced } : {},
      page: 0,
      size: RESULT_LIMIT,
    }),
    enabled: open,
  });
  const customers = data?.data.items ?? [];
  const total = data?.data.totalItems ?? 0;

  const select = (customer: Customer | null) => {
    onSelect(customer);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search name, phone or account no..."
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{isFetching ? "Searching..." : "No customers found."}</CommandEmpty>
            <CommandGroup>
              {allOption && !debounced && (
                <CommandItem value="__all__" onSelect={() => select(null)}>
                  {allOption}
                  <Check className={cn("ml-auto", !value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              )}
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.id}
                  onSelect={() => select(customer)}
                >
                  <div className="min-w-0">
                    <div className="truncate">{customer.name}</div>
                    <div className="text-muted-foreground truncate text-xs">
                      {customer.accountNumber} · {customer.branch?.name}
                    </div>
                  </div>
                  <Check
                    className={cn("ml-auto", customer.id === value ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {total > customers.length && (
              <div className="text-muted-foreground px-3 py-2 text-xs">
                Showing {customers.length} of {total}. Type to narrow down.
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
