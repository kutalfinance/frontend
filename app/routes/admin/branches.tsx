import { Link, Outlet } from "react-router";

import { Building2, Plus } from "lucide-react";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Paragraph } from "@/components/ui/text";

import { useBranchesAdmin, validateBranchSearch } from "@/hooks/data/branches";
import { useAdminMetrics } from "@/hooks/data/users";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/utils/money";
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
    <div className="container space-y-10">
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

      <BranchStats />

      <div className="flex flex-col gap-2">
        <BranchFilters disabled={isPending} />
        <BranchesTable branches={branches} isLoading={isPending} />
      </div>
    </div>
  );
}

function BranchStats() {
  const { data, isPending } = useAdminMetrics();
  const total = data?.data?.totalBranches;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="gap-2">
        <CardHeader>
          <div className="w-fit rounded-md border p-2">
            <Building2 className="text-muted-foreground size-5" />
          </div>
        </CardHeader>
        <CardContent>
          <Paragraph className="text-muted-foreground text-sm">Branches</Paragraph>
          <Heading>{isPending ? <Skeleton className="h-8 w-20" /> : formatMoney(total ?? 0, { style: "decimal" })}</Heading>
        </CardContent>
      </Card>
    </div>
  );
}
