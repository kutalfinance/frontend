import { useSearchParams } from "react-router";

import { Building2, Coins, Contact, SearchIcon } from "lucide-react";

import {
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Paragraph } from "@/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useLoggedInUser } from "@/hooks/auth/common";
import { useBranchesAdmin, validateBranchSearch } from "@/hooks/data/branches";
import { useAgentMetrics } from "@/hooks/data/users";
import { useDebounce } from "@/hooks/use-debounce";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/utils/money";
import { BranchesGrid } from "@/modules/branches/branches-grid";

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
  const { data, isPending } = useBranchesAdmin({
    searchParams: { ...searchParams, agentId: loggedInUser.data.id },
  });
  const branches = data?.data ?? [];

  const [_, setSearchParams] = useSearchParams();
  const debouncedSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      if (e.target.value) prev.set("q", e.target.value);
      else prev.delete("q");
      return prev;
    });
  });

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
        <hgroup className="flex flex-wrap items-center justify-between gap-2">
          <Heading variant="h2">Branches</Heading>
          <div className="relative w-full md:max-w-xs">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search branches..."
              type="search"
              className="w-full pl-9"
              defaultValue={searchParams.q || ""}
              onChange={debouncedSearch}
            />
          </div>
        </hgroup>
        <BranchesGrid branches={branches} isLoading={isPending} />
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
  const { data, isPending } = useAgentMetrics();
  const metrics = data?.data;

  const metricsData = [
    {
      icon: Coins,
      label: "Contributions",
      value: formatMoney(metrics?.totalContributions ?? 0),
    },
    {
      icon: Building2,
      label: "Branches",
      value: formatMoney(metrics?.totalBranches ?? 0, { style: "decimal" }),
    },
    {
      icon: Contact,
      label: "Customers",
      value: formatMoney(metrics?.totalCustomers ?? 0, { style: "decimal" }),
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,auto))] gap-2 lg:grid-cols-3">
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
