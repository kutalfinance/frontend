import { Building2, Coins, Contact } from "lucide-react";

import {
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading, Paragraph } from "@/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useLoggedInUser } from "@/hooks/auth/common";
import { useBranches, validateBranchSearch } from "@/hooks/data/branches";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/utils/money";
import { agentBranchesColumns } from "@/modules/branches/branches-agent";
import { BranchesTable } from "@/modules/branches/branches-table";

import type { Route } from "./+types/index";

export function meta() {
  return [
    { title: `My Branches - ${siteConfig.name}` },
    { name: "description", content: "View and manage your assigned branches" },
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
    searchParams: { ...searchParams, agentId: loggedInUser.data.id },
  });
  const branches = data?.data ?? [];

  return (
    <div className="container space-y-10">
      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Welcome {loggedInUser.data.name}</ModuleTitle>
          <ModuleDescription>
            Your current branches summary and activity. Click on a branch to view its customers and
            manage their accounts.
          </ModuleDescription>
        </ModuleHeader>

        <ToggleGroup variant="outline" type="single" defaultValue={dataRangeOptions[1].value}>
          {dataRangeOptions.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ModuleHeading>

      <DashboardStats />

      <div className="space-y-2">
        <Heading variant="h2">Branches</Heading>
        <BranchesTable branches={branches} isLoading={isPending} columns={agentBranchesColumns} />
      </div>
    </div>
  );
}

const dataRangeOptions = [
  { label: "12 months", value: "12m" },
  { label: "30 days", value: "30d" },
  { label: "7 days", value: "7d" },
  { label: "24 hours", value: "24h" },
];

function DashboardStats() {
  // const { data, isPending } = useAdminMetrics();
  // const metrics = data?.data;

  const metricsData = [
    { icon: Coins, label: "Contributions", value: formatMoney(420302) },
    { icon: Building2, label: "Branches", value: formatMoney(3, { style: "decimal" }) },
    { icon: Contact, label: "Customers", value: formatMoney(1203, { style: "decimal" }) },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,auto))] gap-4 lg:grid-cols-3">
      {metricsData.map((metric) => (
        <Card key={metric.label} className="gap-2">
          <CardHeader>
            <div className="w-fit rounded-md border p-2">
              <metric.icon className="text-muted-foreground size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <Paragraph className="text-muted-foreground text-sm">{metric.label}</Paragraph>
            <Heading>{metric.value}</Heading>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
