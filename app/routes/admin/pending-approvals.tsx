import { useQuery } from "@tanstack/react-query";

import {
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";

import { pendingApprovalsQueryOptions } from "@/hooks/data/transactions";
import { siteConfig } from "@/lib/config";
import { PendingApprovalsTable } from "@/modules/transactions/pending-approvals-table";

export function meta() {
  return [
    { title: `Pending Approvals - ${siteConfig.name}` },
    { name: "description", content: "Review and approve pending transactions" },
  ];
}

export default function PendingApprovals() {
  const { data, isPending } = useQuery(pendingApprovalsQueryOptions());
  const transactions = data?.data ?? [];

  return (
    <div className="container space-y-10">
      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Pending Approvals</ModuleTitle>
          <ModuleDescription>
            Review and approve or reject transactions awaiting approval
          </ModuleDescription>
        </ModuleHeader>
      </ModuleHeading>

      <PendingApprovalsTable transactions={transactions} isLoading={isPending} />
    </div>
  );
}
