import { useLoggedInUser } from "@/hooks/data";
import type { UserRole } from "@/lib/types";

type ProtectedProps = {
  children: React.ReactNode;
} & ({ action: AppAction; roles?: never } | { roles: UserRole[]; action?: never });

// TODO:
// 1. This should be superadmin vs admin
// 2. Move agent validation to new route group

export function Protected({ children, action, roles }: ProtectedProps) {
  const { data } = useLoggedInUser();
  if (!data) return null;

  console.log("User role", data.role, roles);
  if (roles) {
    if (roles.includes(data.role)) return children;

    return null;
  }

  const permissions = PERMISSIONS_MAP[data.role] || [];
  const hasPermission = permissions.includes(action);
  if (hasPermission) return children;

  return null;
}

type AppAction =
  | "users:read"
  | "users:delete"
  | "users:create"
  | "customers:read"
  | "customers:delete"
  | "customers:create"
  | "branches:read";
const PERMISSIONS_MAP: Record<UserRole, AppAction[]> = {
  AGENT: ["branches:read", "users:read", "customers:read"],
  ADMIN: [
    "branches:read",
    "users:read",
    "users:delete",
    "users:create",
    "customers:read",
    "customers:delete",
    "customers:create",
  ],
};
