import { Link, data, href } from "react-router";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowDownUp, Contact, MapPin, TrendingUp, UserCheck, Users } from "lucide-react";

import {
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
import { useAgentMetrics } from "@/hooks/data/users";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/utils/money";

export function meta() {
  return [
    { title: `Dashboard - ${siteConfig.name}` },
    { name: "description", content: "Your branch dashboard" },
  ];
}

export async function clientLoader() {
  try {
    await queryClient.ensureQueryData(branchByAgent);
  } catch (err) {
    throw data("Branch not found", { status: 404 });
  }
}

export default function AgentDashboard() {
  const { data: loggedInUser } = useLoggedInUser();
  const { data: branchData } = useSuspenseQuery(branchByAgent);
  const branch = branchData.data;

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

      </ModuleHeading>

      <DashboardStats />
    </div>
  );
}

type Scope = "today" | "week";

function DashboardStats() {
  const { data, isPending } = useAgentMetrics();
  const metrics = data?.data;

  return (
    <Tabs defaultValue="today">
      <div className="mb-4 flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This week</TabsTrigger>
        </TabsList>
        <Button asChild variant="outline" size="sm">
          <Link to={href("/agent/customers")}>
            <Contact /> Customers
          </Link>
        </Button>
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

const colorClasses = {
  green: "border-l-4 border-l-green-700/50",
  blue: "border-l-4 border-l-blue-600/50",
  red: "border-l-4 border-l-red-600/50",
  amber: "border-l-4 border-l-amber-600/50",
} as const;

function MetricCard({
  icon: Icon,
  label,
  value,
  isPending,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isPending: boolean;
  color?: keyof typeof colorClasses;
}) {
  return (
    <Card className={`gap-2 ${color ? colorClasses[color] : ""}`}>
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
      <div className="grid grid-cols-2 gap-2">
        <MetricCard
          icon={UserCheck}
          label="Customers visited"
          value={customersVisited}
          isPending={isPending}
          color="blue"
        />
        <MetricCard
          icon={Users}
          label="New customers"
          value={newCustomers}
          isPending={isPending}
          color="blue"
        />
      </div>

      <MetricCard
        icon={TrendingUp}
        label="Total collections"
        value={totalCollections}
        isPending={isPending}
        color="green"
      />

      <MetricCard
        icon={ArrowDownUp}
        label="Withdrawals pending"
        value={withdrawalsPending}
        isPending={isPending}
        color="amber"
      />
      <MetricCard
        icon={ArrowDownUp}
        label="Withdrawals approved"
        value={withdrawalsApproved}
        isPending={isPending}
        color="red"
      />
    </div>
  );
}
