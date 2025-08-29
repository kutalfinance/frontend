import type { Route } from "./+types/home";

import { Heading, Paragraph } from "@/components/ui/text";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }, { name: "description", content: "KSS Management Dashboard" }];
}

export default function Home() {
  return (
    <div>
      <hgroup className="flex flex-col">
        <Heading>Dashboard</Heading>
        <Paragraph className="text-muted-foreground max-w-lg">
          Welcome to your management dashboard. Monitor system activity and manage users from here.
        </Paragraph>
      </hgroup>
    </div>
  );
}
