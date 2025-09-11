import { useLoggedInUser } from "@/hooks/data";

type SuperAdminOnlyProps = {
  children: React.ReactNode;
};

export function SuperAdminOnly({ children }: SuperAdminOnlyProps) {
  const { data } = useLoggedInUser();
  if (!data?.superAdmin) return null;

  return children;
}
