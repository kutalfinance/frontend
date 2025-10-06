import { useNavigate, useSearch } from "@tanstack/react-router";

import { ArrowUpDown, SearchIcon } from "lucide-react";

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
import { UserRoles } from "@/lib/types";

export function UserFilters() {
  const search = useSearch({ from: "/admin/users" });
  const navigate = useNavigate({ from: "/admin/users" });

  const debouncedSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) =>
    navigate({ search: (old) => ({ ...old, search: e.target.value || undefined }) })
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
          defaultValue={search.sortBy}
          onValueChange={(value) =>
            navigate({ to: "/admin/users", search: (old) => ({ ...old, sortBy: value }) })
          }
        >
          <SelectTrigger className="w-32">
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

      <Tabs defaultValue={search.role ?? "all"} className="">
        <TabsList>
          <TabsTrigger
            value="all"
            className="capitalize"
            onClick={() => navigate({ search: { role: undefined } })}
          >
            All
          </TabsTrigger>

          {Object.values(UserRoles).map((value) => (
            <TabsTrigger
              key={value}
              value={value}
              className="capitalize"
              onClick={() => navigate({ search: { role: value } })}
            >
              {value.toLowerCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
