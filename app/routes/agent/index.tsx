import { ModuleHeading, ModuleTitle } from "@/components/module-heading";

import { useLoggedInUser } from "@/hooks/auth/common";
import { siteConfig } from "@/lib/config";

export function meta() {
  return [
    { title: `Dashboard - ${siteConfig.name}` },
    { name: "description", content: "Agent dashboard overview" },
  ];
}

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
