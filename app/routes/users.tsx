import { Link, Outlet } from "react-router";

import { Protected } from "@/components/protected";
import { Button } from "@/components/ui/button";
import { Heading, Paragraph } from "@/components/ui/text";

export default function Users() {
  return (
    <div>
      <hgroup className="flex flex-col">
        <div className="flex justify-between gap-5">
          <Heading>User Management</Heading>

          <Protected action="users:create">
            <Button asChild>
              <Link to="/users/create">Create New User</Link>
            </Button>
          </Protected>
        </div>
        <Paragraph className="max-w-lg">
          Manage admin and agent accounts. Create new users, view their status, and control access
          permissions.
        </Paragraph>
      </hgroup>

      <Outlet />
    </div>
  );
}
