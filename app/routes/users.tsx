import { Link, Outlet } from "react-router";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heading, Paragraph } from "@/components/ui/text";

export default function Users() {
  return (
    <div>
      <hgroup className="flex flex-col gap-2">
        <div className="flex justify-between gap-5">
          <Heading>User Management</Heading>

          <Button asChild>
            <Link to="/users/create">Create New User</Link>
          </Button>
        </div>
        <Paragraph>
          Manage admin and agent accounts. Create new users, view their status, and control access
          permissions.
        </Paragraph>
      </hgroup>

      <Outlet />
    </div>
  );
}
