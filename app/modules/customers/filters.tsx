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

import { useBranches } from "@/hooks/data/branches";
import { useDebounce } from "@/hooks/use-debounce";

export function CustomerFilters({ disabled }: { disabled?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: branchesData } = useBranches();
  const branches = branchesData?.data ?? [];

  const hasFilters = Array.from(searchParams.keys()).some((key) => !["q", "sortBy"].includes(key));

  const debouncedSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      if (e.target.value) prev.set("q", e.target.value);
      else prev.delete("q");
      return prev;
    });
  });

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 sm:justify-between">
      <div className="contents flex-1 flex-wrap items-center gap-2 sm:flex">
        <div className="relative w-full md:max-w-xs">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search customers..."
            type="search"
            className="w-full pl-9"
            defaultValue={searchParams.get("q") || ""}
            onChange={debouncedSearch}
          />
        </div>

        <Select
          disabled={disabled}
          value={searchParams.get("branchId") || "all"}
          onValueChange={(value) => {
            setSearchParams((prev) => {
              if (value === "all") value = "";

              if (value) prev.set("branchId", value);
              else prev.delete("branchId");
              return prev;
            });
          }}
        >
          <SelectTrigger>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Branch:</span>
              <SelectValue placeholder="Branch" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="link"
            onClick={() =>
              setSearchParams((prev) => {
                prev.delete("branchId");
                return prev;
              })
            }
          >
            Clear filters
          </Button>
        )}
      </div>

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
        <SelectTrigger>
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
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="location">Location</SelectItem>
          <SelectItem value="createdAt">Created At</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
