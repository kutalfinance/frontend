import { useLoggedInUser } from "@/hooks/data";

type SuperAdminOnlyProps = {
  children: React.ReactNode;
};

export function SuperAdminOnly({ children }: SuperAdminOnlyProps) {
  const { data } = useLoggedInUser();
  if (!data?.data.isSuperAdmin) return null;

  return children;
}
