import { Link, data, href } from "react-router";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Contact, MapPin, Plus } from "lucide-react";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { queryClient } from "@/components/query-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Paragraph } from "@/components/ui/text";

import { useLoggedInUser } from "@/hooks/auth/common";
import { branchByAgent } from "@/hooks/data/branches";
import { useCustomers, validateCustomerSearch } from "@/hooks/data/customers";
import { useAgentMetrics } from "@/hooks/data/users";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/utils/money";
import { CustomersList } from "@/modules/customers/customers-list";
import {
  CustomerFilters,
  CustomerSearchFilter,
  CustomerSortFilter,
} from "@/modules/customers/filters";

import type { Route } from "./+types/index";

export function meta() {
  return [
    { title: `My Branch - ${siteConfig.name}` },
    { name: "description", content: "Manage your branch and customers" },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  try {
    await queryClient.ensureQueryData(branchByAgent);
  } catch (err) {
    throw data("Branch not found", { status: 404 });
  }

  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateCustomerSearch.omit({ branchId: true }).parse(params);
    return { searchParams: validatedParams };
  } catch (error) {
    console.error("Failed to validate search params:", error);
    return { searchParams: {} };
  }
}

export default function AgentDashboard({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;
  const { data: loggedInUser } = useLoggedInUser();

  const { data: branchData } = useSuspenseQuery(branchByAgent);
  const branch = branchData.data;

  const { data: customersData, isPending: customersLoading } = useCustomers({
    searchParams: { ...searchParams, branchId: branch?.id },
  });
  const customers = customersData?.data ?? [];

  return (
    <div className="container space-y-10">
      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Welcome {loggedInUser.data.name}</ModuleTitle>
          <ModuleDescription>
            {branch ? (
              <span className="flex items-center gap-1">
                <MapPin className="size-4" />
                {branch.name}, {branch.location}
              </span>
            ) : (
              "Loading branch information..."
            )}
          </ModuleDescription>
        </ModuleHeader>

        {branch && (
          <ModuleActions>
            <Button asChild>
              <Link to={href("/agent/customers/create")}>
                <Plus /> Add customer
              </Link>
            </Button>
          </ModuleActions>
        )}
      </ModuleHeading>

      <DashboardStats />

      <div className="space-y-2">
        <Heading variant="h2">Customers</Heading>
        <CustomerFilters disabled={customersLoading}>
          <CustomerSearchFilter />
          <CustomerSortFilter />
        </CustomerFilters>
        <CustomersList customers={customers} isLoading={customersLoading} />
      </div>
    </div>
  );
}

function DashboardStats() {
  const { data, isPending } = useAgentMetrics();
  const metrics = data?.data;

  const metricsData = [
    {
      icon: Contact,
      label: "Customers",
      value: formatMoney(metrics?.totalCustomers ?? 0, { style: "decimal" }),
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,auto))] gap-2 lg:grid-cols-2">
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
