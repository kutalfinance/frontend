import { Link, data, href } from "react-router";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowDownUp, MapPin, Plus, TrendingUp, UserCheck, Users } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <CustomerFilters disabled={customersLoading}>
          <div className="flex w-full items-center justify-between gap-2">
            <CustomersHeading />
            <CustomerSortFilter />
          </div>
          <CustomerSearchFilter />
        </CustomerFilters>
        <CustomersList customers={customers} isLoading={customersLoading} />
      </div>
    </div>
  );
}

function CustomersHeading() {
  const { data, isPending } = useAgentMetrics();
  const totalCustomers = data?.data?.totalCustomers;

  return (
    <div className="flex items-center gap-2">
      <Heading variant="h2">Customers</Heading>
      {isPending ? (
        <Skeleton className="h-5 w-8 rounded-full" />
      ) : (
        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-sm font-medium">
          {totalCustomers ?? 0}
        </span>
      )}
    </div>
  );
}

type Scope = "today" | "week";

function DashboardStats() {
  const { data, isPending } = useAgentMetrics();
  const metrics = data?.data;

  return (
    <Tabs defaultValue="today">
      <div className="mb-4 flex justify-end">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This week</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="today">
        <MetricCards scope="today" metrics={metrics} isPending={isPending} />
      </TabsContent>
      <TabsContent value="week">
        <MetricCards scope="week" metrics={metrics} isPending={isPending} />
      </TabsContent>
    </Tabs>
  );
}

type AgentMetricsData = NonNullable<ReturnType<typeof useAgentMetrics>["data"]>["data"];

function MetricCard({
  icon: Icon,
  label,
  value,
  isPending,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isPending: boolean;
}) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <div className="w-fit rounded-md border p-2">
          <Icon className="text-muted-foreground size-5" />
        </div>
      </CardHeader>
      <CardContent>
        <Paragraph className="text-muted-foreground text-sm">{label}</Paragraph>
        <Heading>{isPending ? <Skeleton className="h-8 w-20" /> : value}</Heading>
      </CardContent>
    </Card>
  );
}

function MetricCards({
  scope,
  metrics,
  isPending,
}: {
  scope: Scope;
  metrics: AgentMetricsData | undefined;
  isPending: boolean;
}) {
  const isToday = scope === "today";

  const totalCollections = formatMoney(
    isToday ? (metrics?.totalDepositsToday ?? 0) : (metrics?.totalDepositsThisWeek ?? 0)
  );
  const customersVisited = formatMoney(
    isToday
      ? (metrics?.totalCustomersVisitedToday ?? 0)
      : (metrics?.totalCustomersVisitedThisWeek ?? 0),
    { style: "decimal" }
  );
  const newCustomers = formatMoney(
    isToday ? (metrics?.totalNewCustomersToday ?? 0) : (metrics?.totalNewCustomersThisWeek ?? 0),
    { style: "decimal" }
  );
  const withdrawalsApproved = formatMoney(
    isToday
      ? (metrics?.totalWithdrawalsApprovedToday ?? 0)
      : (metrics?.totalWithdrawalsApprovedThisWeek ?? 0)
  );
  const withdrawalsPending = formatMoney(metrics?.totalWithdrawalsPending ?? 0);

  return (
    <div className="space-y-2">
      <MetricCard icon={TrendingUp} label="Total collections" value={totalCollections} isPending={isPending} />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_1fr]">
        <MetricCard icon={UserCheck} label="Customers visited" value={customersVisited} isPending={isPending} />
        <MetricCard icon={Users} label="New customers" value={newCustomers} isPending={isPending} />
        <div className="flex flex-col gap-2">
          <MetricCard icon={ArrowDownUp} label="Withdrawals pending" value={withdrawalsPending} isPending={isPending} />
          <MetricCard icon={ArrowDownUp} label="Withdrawals approved" value={withdrawalsApproved} isPending={isPending} />
        </div>
      </div>
    </div>
  );
}
