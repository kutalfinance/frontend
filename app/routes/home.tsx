import {
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";

import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }, { name: "description", content: "KSS Management Dashboard" }];
}

export default function Home() {
  return (
    <div>
      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Dashboard</ModuleTitle>
        </ModuleHeader>
        <ModuleDescription className="text-muted-foreground">
          Welcome to your management dashboard. Monitor system activity and manage users from here.
        </ModuleDescription>
      </ModuleHeading>
    </div>
  );
}
