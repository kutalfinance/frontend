import { useLoggedInUser } from "@/hooks/auth/common";

type SuperAdminOnlyProps = {
  children: React.ReactNode;
};

export function SuperAdminOnly({ children }: SuperAdminOnlyProps) {
  const { data } = useLoggedInUser();
  if (!data?.data.isSuperAdmin) return null;

  return children;
}
