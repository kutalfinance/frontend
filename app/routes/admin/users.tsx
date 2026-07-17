import { Link, Outlet } from "react-router";

import { Archive, Plus, Users } from "lucide-react";

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

import { useLoggedInUser } from "@/hooks/auth/common";
import { useAdminMetrics, useUsers, validateUserSearch } from "@/hooks/data/users";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/utils/money";
import { UserFilters } from "@/modules/users/filters";
import { UsersTable } from "@/modules/users/users-table";

import type { Route } from "./+types/users";

export function meta() {
  return [
    { title: `Dashboard - ${siteConfig.name}` },
    { name: "description", content: "Admin dashboard overview" },
  ];
}

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateUserSearch.parse(params);
    return { searchParams: validatedParams };
  } catch (error) {
    console.error("Failed to validate search params:", error);
    return { searchParams: {} };
  }
}

export default function AdminDashboard({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;

  const { data: usersData, isPending } = useUsers({ searchParams });
  const users = usersData?.data ?? [];

  const { data } = useLoggedInUser();
  const user = data?.data;

  if (!user) return null;

  return (
    <div className="container space-y-10">
      <Outlet />

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>User Management</ModuleTitle>
          <ModuleDescription>Monitor key metrics and manage users.</ModuleDescription>
        </ModuleHeader>

        <ModuleActions>
          <Button asChild>
            <Link to="/admin/users/create">
              <Plus /> Add user
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/users/deactivated">
              <Archive />
            </Link>
          </Button>
        </ModuleActions>
      </ModuleHeading>

      <DashboardStats />

      <div className="flex flex-col gap-2">
        <UserFilters disabled={isPending} />
        <UsersTable users={users} isLoading={isPending} />
      </div>
    </div>
  );
}

/* const dataRangeOptions = [
  { label: "12 months", value: "12m" },
  { label: "30 days", value: "30d" },
  { label: "7 days", value: "7d" },
  { label: "24 hours", value: "24h" },
]; */

function DashboardStats() {
  const { data, isPending } = useAdminMetrics();
  const metrics = data?.data;

  const metricsData = [
    {
      icon: Users,
      label: "Users",
      value: formatMoney(metrics?.totalUsers ?? 0, { style: "decimal" }),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {metricsData.map((metric) => (
        <Card key={metric.label} className="gap-2">
          <CardHeader>
            <div className="w-fit rounded-md border p-2">
              <metric.icon className="text-muted-foreground size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <Paragraph className="text-muted-foreground text-sm">{metric.label}</Paragraph>
            <Heading>{isPending ? <Skeleton className="h-8 w-20" /> : metric.value}</Heading>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
