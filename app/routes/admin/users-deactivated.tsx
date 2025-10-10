import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useUsers, validateUserSearch } from "@/hooks/data/users";
import { DeactivatedUsersTable } from "@/modules/users/deactivated-users-table";

import type { Route } from "./+types/users-deactivated";
import { useNavigate } from "react-router";

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateUserSearch.parse(params);
    return { searchParams: { ...validatedParams, isDeactivated: true } };
  } catch {
    return { searchParams: { isDeactivated: true } };
  }
}

export default function DeactivatedUsers({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;

  const navigate = useNavigate();

  const { data, isPending } = useUsers({ searchParams });
  const users = data?.data ?? [];

  return (
    <Sheet open onOpenChange={() => navigate(-1)}>
      <SheetContent className="w-full sm:max-w-screen-lg">
        <SheetHeader>
          <SheetTitle>Deactivated Users</SheetTitle>
          <SheetDescription>
            View and manage deactivated user accounts. You can reactivate users to restore their
            access to the system.
          </SheetDescription>
        </SheetHeader>

        <div className="container">
          <DeactivatedUsersTable users={users} isLoading={isPending} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
