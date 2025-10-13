import { Link, Outlet } from "react-router";
import { Plus } from "lucide-react";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Button } from "@/components/ui/button";

import { useBranches, validateBranchSearch } from "@/hooks/data/branches";
import {
  BranchClearFilters,
  BranchFilters,
  BranchSearchFilter,
  BranchSortFilter,
} from "@/modules/branches/filters";
import { BranchesTable } from "@/modules/branches/branches-table";
import { siteConfig } from "@/lib/config";

import type { Route } from "./+types/branches";
import { useLoggedInUser } from "@/hooks/auth/common";
import { agentBranchesColumns } from "@/modules/branches/branches-agent";

export function meta() {
  return [
    { title: `Branches - ${siteConfig.name}` },
    { name: "description", content: "Manage your branch locations" },
  ];
}

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateBranchSearch.omit({ agentId: true }).parse(params);
    return { searchParams: validatedParams };
  } catch {
    return { searchParams: {} };
  }
}

export default function Branches({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;
  const { data: loggedInUser } = useLoggedInUser();
  const { data, isPending } = useBranches({
    searchParams: { ...searchParams, agentId: loggedInUser?.data.id },
  });
  const branches = data?.data ?? [];

  return (
    <div className="container">
      <Outlet />

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Branch Management</ModuleTitle>
          <ModuleDescription>
            Manage branch locations and agent assignments. Create new branches, assign agents, and
            track branch performance.
          </ModuleDescription>
        </ModuleHeader>
        <ModuleActions>
          <Button asChild>
            <Link to="/agent/branches/create">
              <Plus /> Add branch
            </Link>
          </Button>
        </ModuleActions>
      </ModuleHeading>

      <BranchFilters disabled={isPending}>
        <BranchSearchFilter />
        <BranchClearFilters />
        <BranchSortFilter />
      </BranchFilters>

      <BranchesTable columns={agentBranchesColumns} branches={branches} isLoading={isPending} />
    </div>
  );
}
