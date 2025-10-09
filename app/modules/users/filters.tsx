import { useSearchParams } from "react-router";

import { ArrowUpDown, SearchIcon, ShieldBan, ShieldCheck } from "lucide-react";

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

export function UserFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const debouncedSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      if (e.target.value) prev.set("q", e.target.value);
      else prev.delete("q");
      return prev;
    });
  });

  return (
    <div className="container mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full max-w-64">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search users..."
            type="search"
            className="w-full pl-9"
            defaultValue={searchParams.get("q") || ""}
            onChange={debouncedSearch}
          />
        </div>

        <Select
          value={searchParams.get("sortBy") || "createdAt"}
          onValueChange={(value) => {
            setSearchParams((prev) => {
              if (value) prev.set("sortBy", value);
              else prev.delete("sortBy");
              return prev;
            });
          }}
        >
          <SelectTrigger className="w-36">
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="size-4" />
              <SelectValue placeholder="Sort By" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="role">Role</SelectItem>
            <SelectItem value="createdAt">Created At</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs
        defaultValue={searchParams.get("status") || "active"}
        onValueChange={(value) => {
          setSearchParams((prev) => {
            if (value) prev.set("status", value);
            else prev.delete("status");
            return prev;
          });
        }}
      >
        <TabsList>
          <TabsTrigger value="ACTIVE" className="capitalize">
            <ShieldCheck className="text-muted-foreground" />
            Active {/* ({data?.activeCount ?? 0}) */}
          </TabsTrigger>

          <TabsTrigger value="INACTIVE" className="capitalize">
            <ShieldBan className="text-muted-foreground" />
            Inactive {/* ({data?.inactiveCount ?? 0}) */}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
