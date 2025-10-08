import { useNavigate, useSearch } from "@tanstack/react-router";

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
  const search = useSearch({ from: "/admin/users" });
  const navigate = useNavigate({ from: "/admin/users" });

  const debouncedSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) =>
    navigate({ search: (old) => ({ ...old, q: e.target.value || undefined }) })
  );

  return (
    <div className="container mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full max-w-64">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search users..."
            type="search"
            className="w-full pl-9"
            defaultValue={search.q}
            onChange={debouncedSearch}
          />
        </div>

        <Select
          value={search.sortBy}
          onValueChange={(value) =>
            navigate({ search: (old) => ({ ...old, sortBy: value || undefined }) })
          }
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

      <Tabs defaultValue="active" className="">
        <TabsList>
          <TabsTrigger value="active" className="capitalize">
            <ShieldCheck /> Active {/* ({data?.activeCount ?? 0}) */}
          </TabsTrigger>

          <TabsTrigger value="inactive" className="capitalize">
            <ShieldBan />
            Inactive {/* ({data?.inactiveCount ?? 0}) */}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
