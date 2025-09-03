import { Link, Outlet } from "react-router";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Protected } from "@/components/protected";
import { Button } from "@/components/ui/button";

export default function Customers() {
  return (
    <div>
      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Customer Management</ModuleTitle>
          <ModuleActions>
            <Protected action="customers:create">
              <Button asChild>
                <Link to="/customers/create">Create New Customer</Link>
              </Button>
            </Protected>
          </ModuleActions>
        </ModuleHeader>
        <ModuleDescription>
          Manage customer accounts and information. Create new customers, view their details, and
          track customer interactions.
        </ModuleDescription>
      </ModuleHeading>

      <Outlet />
    </div>
  );
}
