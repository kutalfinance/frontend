import { ModuleHeading, ModuleTitle } from "@/components/module-heading";

import { useLoggedInUser } from "@/hooks/auth/common";

export default function AgentDashboard() {
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
