import { Outlet } from "react-router";

import { GroupLink } from "@/components/group-link";
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
              <GroupLink to="users/create">Create New User</GroupLink>
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
