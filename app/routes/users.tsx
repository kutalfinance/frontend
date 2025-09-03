import { Link, Outlet } from "react-router";

import { Protected } from "@/components/protected";
import { Button } from "@/components/ui/button";
import {
  ModuleHeading,
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleTitle,
} from "@/components/module-heading";

export default function Users() {
  return (
    <div>
      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>User Management</ModuleTitle>
          <ModuleActions>
            <Protected action="users:create">
              <Button asChild>
                <Link to="/users/create">Create New User</Link>
              </Button>
            </Protected>
          </ModuleActions>
        </ModuleHeader>
        <ModuleDescription>
          Manage admin and agent accounts. Create new users, view their status, and control access
          permissions.
        </ModuleDescription>
      </ModuleHeading>

      <Outlet />
    </div>
  );
}
