import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_main/u/users")({
  component: Users,
});

function Users() {
  return (
    <div>
      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>User Management</ModuleTitle>
          <ModuleActions>
            <Button asChild>
              <Link to="/u/users/create">Create New User</Link>
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
