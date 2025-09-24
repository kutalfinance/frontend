import { createFileRoute } from "@tanstack/react-router";

import { useLoggedInUser } from "@/hooks/auth/common";
import { ModuleHeading, ModuleTitle } from "@/components/module-heading";

export const Route = createFileRoute("/agent/")({
  component: AgentDashboard,
});

function AgentDashboard() {
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