import { useLoggedInUser } from "@/hooks/auth/common";

type SuperAdminOnlyProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function SuperAdminOnly({ children, fallback = null }: SuperAdminOnlyProps) {
  const { data } = useLoggedInUser();

  if (!data?.data?.superAdmin) return fallback;

  return <>{children}</>;
}
