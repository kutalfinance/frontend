import { ModuleHeading, ModuleTitle } from "@/components/module-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Paragraph } from "@/components/ui/text";

import { useLoggedInUser } from "@/hooks/auth/common";
import { useAdminMetrics } from "@/hooks/data/users";
import { siteConfig } from "@/lib/config";

export function meta() {
  return [
    { title: `Dashboard - ${siteConfig.name}` },
    { name: "description", content: "Admin dashboard overview" },
  ];
}

export default function AdminDashboard() {
  const { data } = useLoggedInUser();
  const user = data?.data;

  if (!user) return null;

  return (
    <div className="container">
      <ModuleHeading>
        <ModuleTitle>Welcome {user.name}</ModuleTitle>
      </ModuleHeading>

      <DashboardStats />
    </div>
  );
}

function DashboardStats() {
  const { data, isPending } = useAdminMetrics();
  const metrics = data?.data;

  const metricsData = [
    { label: "Total Users", value: metrics?.totalUsers ?? 0 },
    { label: "Total Branches", value: metrics?.totalBranches ?? 0 },
    { label: "Total Customers", value: metrics?.totalCustomers ?? 0 },
  ];

  if (isPending) {
    return (
      <div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,auto))] gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-card rounded-md border p-4">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,auto))] gap-4">
        {metricsData.map((metric) => (
          <div key={metric.label} className="bg-card rounded-md border p-4">
            <Paragraph className="text-muted-foreground text-sm">{metric.label}</Paragraph>
            <Heading className="mt-2">{metric.value}</Heading>
          </div>
        ))}
      </div>
    </div>
  );
}
