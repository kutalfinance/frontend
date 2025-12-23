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

import { useBranchesAdmin, validateBranchSearch } from "@/hooks/data/branches";
import { siteConfig } from "@/lib/config";
import { BranchesTable } from "@/modules/branches/branches-table";
import { BranchFilters } from "@/modules/branches/filters";

import type { Route } from "./+types/branches";

export function meta() {
  return [
    { title: `Branches - ${siteConfig.name}` },
    { name: "description", content: "Manage branch locations and agents" },
  ];
}

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateBranchSearch.parse(params);
    return { searchParams: validatedParams };
  } catch (error) {
    console.error("Failed to validate search params:", error);
    return { searchParams: {} };
  }
}

export default function Branches({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;
  const { data, isPending } = useBranchesAdmin({ searchParams });
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
            <Link to="/admin/branches/create">
              <Plus /> Add branch
            </Link>
          </Button>
        </ModuleActions>
      </ModuleHeading>

      <BranchFilters disabled={isPending} />
      <BranchesTable branches={branches} isLoading={isPending} />
    </div>
  );
}
