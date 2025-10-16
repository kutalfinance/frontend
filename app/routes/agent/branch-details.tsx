import { Link, Outlet, data, href } from "react-router";

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
  try {
    await queryClient.ensureQueryData(branchByIdQueryOptions(params.branchId));
  } catch (err) {
    throw data("Branch not found", { status: 404 });
  }

  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateCustomerSearch.parse(searchParams);
    return { searchParams: validatedParams };
  } catch {
    return { searchParams: {} };
  }
}

export default function AgentBranchCustomers({ loaderData, params }: Route.ComponentProps) {
  const { searchParams } = loaderData;
  const { data: branchData } = useSuspenseQuery(branchByIdQueryOptions(params.branchId));
  const branch = branchData.data;

  const { data, isPending } = useCustomers({
    searchParams: { ...searchParams, branchId: params.branchId },
  });
  const customers = data?.data ?? [];

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

      <CustomersList customers={customers} isLoading={isPending} />
    </div>
  );
}
