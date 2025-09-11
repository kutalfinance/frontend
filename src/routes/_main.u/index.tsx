import { createFileRoute } from "@tanstack/react-router";

import { Heading } from "@/components/ui/text";

import { useLoggedInUser } from "@/hooks/data";

export const Route = createFileRoute("/_main/u/")({
  component: App,
});

function App() {
  const { data: user } = useLoggedInUser();

  if (!user) return null;

  return (
    <>
      <Heading>Welcome {user.name}</Heading>
    </>
  );
}
