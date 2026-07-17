import { Link, Outlet } from "react-router";

import { Plus, Upload } from "lucide-react";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Button } from "@/components/ui/button";

import { useCustomers, validateCustomerSearch } from "@/hooks/data/customers";
import { siteConfig } from "@/lib/config";
import { CustomerBulkUpload } from "@/modules/customers/customer-bulk-upload";
import { CustomersTable } from "@/modules/customers/customers-table";
import {
  CustomerBranchFilter,
  CustomerClearFilters,
  CustomerFilters,
  CustomerSearchFilter,
  CustomerSortFilter,
} from "@/modules/customers/filters";

import type { Route } from "./+types/customers";

export function meta() {
  return [
    { title: `Customers - ${siteConfig.name}` },
    { name: "description", content: "Manage customer accounts" },
  ];
}

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateCustomerSearch.parse(params);
    return { searchParams: validatedParams };
  } catch (error) {
    console.error("Failed to validate search params:", error);
    return { searchParams: {} };
  }
}

export default function Customers({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;
  const { data, isPending } = useCustomers({ searchParams });
  const customers = data?.data ?? [];

  return (
    <div className="container">
      <Outlet />

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Customer Management</ModuleTitle>
          <ModuleDescription>
            Manage customer accounts and information. Create new customers, view their details, and
            track customer interactions.
          </ModuleDescription>
        </ModuleHeader>
        <ModuleActions>
          <CustomerBulkUpload asChild>
            <Button variant="outline">
              <Upload /> Upload Customers
            </Button>
          </CustomerBulkUpload>
          <Button asChild>
            <Link to="/admin/customers/create">
              <Plus /> Add customer
            </Link>
          </Button>
        </ModuleActions>
      </ModuleHeading>

      <CustomerFilters disabled={isPending}>
        <CustomerSearchFilter />
        <CustomerBranchFilter />
        <CustomerClearFilters />
        <CustomerSortFilter />
      </CustomerFilters>
      <CustomersTable customers={customers} isLoading={isPending} />
    </div>
  );
}
