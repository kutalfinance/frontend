import { Link, Outlet } from "react-router";

import { Contact, Plus, Upload } from "lucide-react";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Paragraph } from "@/components/ui/text";

import { useCustomers, validateCustomerSearch } from "@/hooks/data/customers";
import { useAdminMetrics } from "@/hooks/data/users";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/utils/money";
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
    <div className="container space-y-10">
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

      <CustomerStats />

      <div className="flex flex-col gap-2">
        <CustomerFilters disabled={isPending}>
          <CustomerSearchFilter />
          <CustomerBranchFilter />
          <CustomerClearFilters />
          <CustomerSortFilter />
        </CustomerFilters>
        <CustomersTable customers={customers} isLoading={isPending} />
      </div>
    </div>
  );
}

function CustomerStats() {
  const { data, isPending } = useAdminMetrics();
  const total = data?.data?.totalCustomers;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="gap-2">
        <CardHeader>
          <div className="w-fit rounded-md border p-2">
            <Contact className="text-muted-foreground size-5" />
          </div>
        </CardHeader>
        <CardContent>
          <Paragraph className="text-muted-foreground text-sm">Customers</Paragraph>
          <Heading>{isPending ? <Skeleton className="h-8 w-20" /> : formatMoney(total ?? 0, { style: "decimal" })}</Heading>
        </CardContent>
      </Card>
    </div>
  );
}
