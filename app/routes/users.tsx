import { Link, Outlet } from "react-router";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Button } from "@/components/ui/button";

export default function Users() {
  return (
    <div>
      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>User Management</ModuleTitle>
          <ModuleActions>
            <Button asChild>
              <Link to="/users/create">Create New User</Link>
            </Button>
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
