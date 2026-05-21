import { Link, data, href } from "react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import {
  ModuleActions,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { queryClient } from "@/components/query-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading } from "@/components/ui/text";

import { branchByAgent } from "@/hooks/data/branches";
import { useCustomers, validateCustomerSearch } from "@/hooks/data/customers";
import { useAgentMetrics } from "@/hooks/data/users";
import { siteConfig } from "@/lib/config";
import { CustomersList } from "@/modules/customers/customers-list";
import {
  CustomerFilters,
  CustomerSearchFilter,
  CustomerSortFilter,
} from "@/modules/customers/filters";

import type { Route } from "./+types/customers";

export function meta() {
  return [
    { title: `Customers - ${siteConfig.name}` },
    { name: "description", content: "Manage your branch customers" },
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

export default function AgentCustomers({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;

  const { data: branchData } = useSuspenseQuery(branchByAgent);
  const branch = branchData.data;

  const { data: customersData, isPending: customersLoading } = useCustomers({
    searchParams: { ...searchParams, branchId: branch?.id },
  });
  const customers = customersData?.data ?? [];

  return (
    <div className="container space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={href("/agent")}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Customers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ModuleHeading>
        <ModuleHeader>
          <CustomersHeading />
        </ModuleHeader>
        <ModuleActions>
          <Button asChild>
            <Link to={href("/agent/customers/create")}>
              <Plus /> Add customer
            </Link>
          </Button>
        </ModuleActions>
      </ModuleHeading>

      <CustomerFilters disabled={customersLoading}>
        <div className="flex w-full items-center justify-between gap-2">
          <CustomerSearchFilter />
          <CustomerSortFilter />
        </div>
      </CustomerFilters>

      <CustomersList customers={customers} isLoading={customersLoading} />
    </div>
  );
}

function CustomersHeading() {
  const { data, isPending } = useAgentMetrics();
  const totalCustomers = data?.data?.totalCustomers;

  return (
    <div className="flex items-center gap-2">
      <Heading variant="h1">Customers</Heading>
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
