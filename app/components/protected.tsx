import { useLoggedInUser } from "@/hooks/auth/common";

type ProtectedProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function SuperAdminOnly({ children, fallback = null }: ProtectedProps) {
  const { data } = useLoggedInUser();

  if (!data?.data?.superAdmin) return fallback;

  return <>{children}</>;
}

export function AdminOnly({ children, fallback = null }: ProtectedProps) {
  const { data } = useLoggedInUser();

  if (data?.data?.role !== "ADMIN") return fallback;

  return <>{children}</>;
}
