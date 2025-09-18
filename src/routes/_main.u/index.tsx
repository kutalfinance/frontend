import { createFileRoute } from "@tanstack/react-router";

import { useLoggedInUser } from "@/hooks/data";
import { ModuleHeading, ModuleTitle } from "@/components/module-heading";

export const Route = createFileRoute("/_main/u/")({
  component: App,
});

function App() {
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
