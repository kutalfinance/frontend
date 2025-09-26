import { createFileRoute } from "@tanstack/react-router";

import { ModuleHeading, ModuleTitle } from "@/components/module-heading";

import { useLoggedInUser } from "@/hooks/auth/common";

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
