import { useLoggedInUser } from "@/hooks/auth/common";

type SuperAdminOnlyProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function SuperAdminOnly({ children, fallback = null }: SuperAdminOnlyProps) {
  const { data, isLoading, error } = useLoggedInUser();

  // Handle loading state - don't show content while loading
  if (isLoading) return fallback;

  // Handle error state - don't show content if error occurred
  if (error) return fallback;

  // Only show content if user is explicitly a super admin
  if (!data?.data?.superAdmin) return fallback;

  return <>{children}</>;
}
