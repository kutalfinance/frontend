import { Link, Outlet, href } from "react-router";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { queryClient } from "@/components/query-provider";
import { ResourceNotFound } from "@/components/resource-not-found";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import { branchByIdQueryOptions } from "@/hooks/data/branches";
import { useCustomers, validateCustomerSearch } from "@/hooks/data/customers";
import { siteConfig } from "@/lib/config";
import { CustomersList } from "@/modules/customers/customers-list";
import {
  CustomerFilters,
  CustomerSearchFilter,
  CustomerSortFilter,
} from "@/modules/customers/filters";

import type { Route } from "./+types/branch-details";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `Branch Customers - ${siteConfig.name}` },
    { name: "description", content: "Manage customers in this branch" },
  ];
}

export async function clientLoader({ request, params }: Route.ClientLoaderArgs) {
  const response = await queryClient.ensureQueryData(branchByIdQueryOptions(params.branchId));

  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateCustomerSearch.parse(searchParams);
    return { branch: response.data, searchParams: validatedParams, branchId: params.branchId };
  } catch {
    return { branch: response.data, searchParams: {}, branchId: params.branchId };
  }
}

export default function AgentBranchCustomers({ loaderData }: Route.ComponentProps) {
  const { searchParams, branchId } = loaderData;

  const { data: branchData, isPending: isBranchLoading } = useSuspenseQuery(
    branchByIdQueryOptions(branchId)
  );
  const branch = branchData.data;

  const { data, isPending } = useCustomers({ searchParams: { ...searchParams, branchId } });
  const customers = data?.data ?? [];

  if (!isBranchLoading && !branch) {
    return <ResourceNotFound resourceName="Branch" backTo="/agent" />;
  }

  return (
    <div className="container">
      <Outlet />

      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={href("/agent")}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{branch.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>{branch.name}</ModuleTitle>
          <ModuleDescription>
            Manage customers and their contributions in {branch?.name ?? "this branch"}
          </ModuleDescription>
        </ModuleHeader>
        <ModuleActions>
          <Button asChild>
            <Link to="#">
              <Plus /> Add customer
            </Link>
          </Button>
        </ModuleActions>
      </ModuleHeading>

      <CustomerFilters disabled={isPending}>
        <CustomerSearchFilter />
        <CustomerSortFilter />
      </CustomerFilters>

      <CustomersList customers={customers} isLoading={isPending || isBranchLoading} />
    </div>
  );
}
