import { Link, href } from "react-router";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowDownUp, BanknoteArrowDown } from "lucide-react";

import {
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Loader } from "@/components/loader";
import { Paragraph } from "@/components/ui/text";

import { transactionsQueryOptions } from "@/hooks/data/transactions";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/utils/money";

export function meta() {
  return [
    { title: `Pending Withdrawals - ${siteConfig.name}` },
    { name: "description", content: "Pending withdrawal requests from your branch customers" },
  ];
}

export default function AgentPendingWithdrawals() {
  const { data, isPending } = useQuery(
    transactionsQueryOptions({ searchParams: { type: "WITHDRAWAL", status: "PENDING" } })
  );
  const transactions = data?.data ?? [];

  return (
    <div className="container space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={href("/agent")}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pending Withdrawals</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Pending Withdrawals</ModuleTitle>
          <ModuleDescription>
            Withdrawal requests from your branch awaiting admin approval
          </ModuleDescription>
        </ModuleHeader>
      </ModuleHeading>

      {isPending ? (
        <Loader />
      ) : transactions.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ArrowDownUp />
            </EmptyMedia>
            <EmptyTitle>No pending withdrawals</EmptyTitle>
            <EmptyDescription>All withdrawal requests have been reviewed.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <Link
              key={tx.id}
              to={href("/agent/customers/:customerId", { customerId: tx.customer.id })}
              className="bg-card hover:bg-muted/30 flex items-start justify-between rounded-lg border p-4 transition-colors"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <Paragraph className="truncate font-medium">{tx.customer.name}</Paragraph>
                <Paragraph className="text-muted-foreground text-xs">
                  Requested {format(new Date(tx.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                </Paragraph>
              </div>

              <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
                <div className="flex items-center gap-1 font-semibold">
                  <BanknoteArrowDown className="text-destructive size-4" />
                  {formatMoney(tx.amount)}
                </div>
                {(tx.serviceChargeAmount ?? 0) > 0 && (
                  <Badge variant="secondary" className="text-destructive text-xs">
                    + {formatMoney(tx.serviceChargeAmount!)} fee
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
