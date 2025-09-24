import { createFileRoute } from "@tanstack/react-router";

import { useLoggedInUser } from "@/hooks/auth/common";
import { ModuleHeading, ModuleTitle } from "@/components/module-heading";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data } = useLoggedInUser();
  const user = data?.data;

  if (!user) return null;

  return (
    <>
      <ModuleHeading>
        <ModuleTitle>Welcome {user.name}</ModuleTitle>
      </ModuleHeading>
    </>
  );
}