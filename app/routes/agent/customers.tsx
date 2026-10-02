import { useState } from "react";
import { Link, href } from "react-router";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon, Plus } from "lucide-react";

import {
  ModuleActions,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Paragraph } from "@/components/ui/text";

import { branchByAgent } from "@/hooks/data/branches";
import { pagedCustomersQueryOptions, validateCustomerSearch } from "@/hooks/data/customers";
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
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);
  try {
    const validatedParams = validateCustomerSearch.omit({ branchId: true }).parse(params);
    return { searchParams: validatedParams };
  } catch {
    return { searchParams: {} };
  }
}

export default function AgentCustomers({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;

  // Warm the branch cache for the rest of the agent pages.
  useSuspenseQuery(branchByAgent);

  // The server scopes agents to their own branch. Reset to the first page
  // whenever the filters change.
  const filtersKey = JSON.stringify(searchParams);
  const [page, setPage] = useState({ filtersKey, index: 0 });
  const pageIndex = page.filtersKey === filtersKey ? page.index : 0;

  const { data: customersData, isPending: customersLoading } = useQuery(
    pagedCustomersQueryOptions({ searchParams, page: pageIndex })
  );
  const customers = customersData?.data.items ?? [];
  const totalPages = customersData?.data.totalPages ?? 0;

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

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <Paragraph className="text-muted-foreground text-sm">
            Page {pageIndex + 1} of {totalPages}
          </Paragraph>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage({ filtersKey, index: pageIndex - 1 })}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage({ filtersKey, index: pageIndex + 1 })}
              disabled={pageIndex >= totalPages - 1}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
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
