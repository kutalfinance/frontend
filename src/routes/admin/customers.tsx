import { createFileRoute } from "@tanstack/react-router";
import { Link, Outlet } from "@tanstack/react-router";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCustomers } from "@/hooks/data/customers";
import { CustomersTable } from "@/modules/customers/data-table";

export const Route = createFileRoute("/admin/customers")({
  component: Customers,
});

function Customers() {
  const { data } = useCustomers();
  const customers = data?.data ?? [];

  return (
    <div>
      <Outlet />

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Customer Management</ModuleTitle>
          <ModuleActions>
            <Button asChild>
              <Link to="/admin/customers/create">Create New Customer</Link>
            </Button>
          </ModuleActions>
        </ModuleHeader>
        <ModuleDescription>
          Manage customer accounts and information. Create new customers, view their details, and
          track customer interactions.
        </ModuleDescription>
      </ModuleHeading>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div></div>
          <Input placeholder="Filter by name or email..." className="w-full max-w-sm" />
        </div>

        <CustomersTable customers={customers} />
      </div>
    </div>
  );
}
