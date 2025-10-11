import { Link, Outlet } from "react-router";

import { Archive, Plus } from "lucide-react";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Button } from "@/components/ui/button";

import { useUsers, validateUserSearch } from "@/hooks/data/users";
import { UserFilters } from "@/modules/users/filters";
import { siteConfig } from "@/lib/config";

import type { Route } from "./+types/users";
import { UsersTable } from "@/modules/users/users-table";

export function meta() {
  return [
    { title: `Users - ${siteConfig.name}` },
    { name: "description", content: "Manage admin and agent accounts" },
  ];
}

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateUserSearch.parse(params);
    return { searchParams: validatedParams };
  } catch {
    return { searchParams: {} };
  }
}

export default function Users({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;

  const { data, isPending } = useUsers({ searchParams });
  const users = data?.data ?? [];

  return (
    <div className="container">
      <Outlet />

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>User Management</ModuleTitle>
          <ModuleDescription>
            Manage admin and agent accounts. Create new users, view their status, and control access
            permissions.
          </ModuleDescription>
        </ModuleHeader>
        <ModuleActions>
          <Button asChild>
            <Link to="/admin/users/create">
              <Plus /> Add user
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/users/deactivated">
              <Archive />
            </Link>
          </Button>
        </ModuleActions>
      </ModuleHeading>

      <UserFilters disabled={isPending} />
      <UsersTable users={users} isLoading={isPending} />
    </div>
  );
}
