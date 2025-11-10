import { Outlet } from "react-router";

import { useQuery } from "@tanstack/react-query";

import {
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";

import { listAuditlogsOptions, validateAuditSearch } from "@/hooks/data/logs";
import { siteConfig } from "@/lib/config";
import { AuditTable } from "@/modules/audit/audit-table";

import type { Route } from "./+types/audit";

export function meta() {
  return [
    { title: `Audit Logs - ${siteConfig.name}` },
    { name: "description", content: "View system audit logs and activities" },
  ];
}

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateAuditSearch.parse(params);
    return { searchParams: validatedParams };
  } catch {
    return { searchParams: {} };
  }
}

export default function AuditLogs({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;
  const { data, isPending } = useQuery(listAuditlogsOptions({ searchParams }));
  const auditLogs = data?.data ?? [];

  return (
    <div className="container">
      <Outlet />

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Audit Logs</ModuleTitle>
          <ModuleDescription>
            View system activity logs and track user actions across the application
          </ModuleDescription>
        </ModuleHeader>
      </ModuleHeading>

      <AuditTable logs={auditLogs} isLoading={isPending} />
    </div>
  );
}
