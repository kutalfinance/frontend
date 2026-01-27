import { Outlet } from "react-router";

import { useQuery } from "@tanstack/react-query";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { Button } from "@/components/ui/button";

import { useLoggedInUser } from "@/hooks/auth/common";
import { transactionsQueryOptions, validateTransactionsSearch } from "@/hooks/data/transactions";
import { siteConfig } from "@/lib/config";
import {
  AdminRecordDeposit,
  AdminRecordWithdrawal,
} from "@/modules/transactions/admin-transaction-create";
import {
  TransactionClearFilters,
  TransactionCustomerFilter,
  TransactionFilters,
  TransactionSearchFilter,
  TransactionSortFilter,
  TransactionStatusFilter,
  TransactionTypeFilter,
} from "@/modules/transactions/transaction-filters";
import { TransactionMetrics } from "@/modules/transactions/transaction-metrics";
import { TransactionsTable } from "@/modules/transactions/transactions-table";

import type { Route } from "./+types/transactions";

export function meta() {
  return [
    { title: `Transactions - ${siteConfig.name}` },
    { name: "description", content: "View all customer transactions" },
  ];
}

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateTransactionsSearch.parse(params);
    return { searchParams: validatedParams };
  } catch (error) {
    console.error("Failed to validate search params:", error);
    return { searchParams: {} };
  }
}

export default function Transactions({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;
  const { data, isPending } = useQuery(transactionsQueryOptions({ searchParams }));
  const transactions = data?.data ?? [];

  const { data: userData } = useLoggedInUser();
  const user = userData?.data;

  return (
    <div className="container space-y-10">
      <Outlet />

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Welcome {user.name}</ModuleTitle>
          <ModuleDescription>
            View all customer transactions, deposits, and withdrawals across all branches
          </ModuleDescription>
        </ModuleHeader>
        <ModuleActions>
          <AdminRecordDeposit asChild>
            <Button>
              <BanknoteArrowUp /> Record deposit
            </Button>
          </AdminRecordDeposit>
          <AdminRecordWithdrawal asChild>
            <Button variant="destructive-outline">
              <BanknoteArrowDown /> Record withdrawal
            </Button>
          </AdminRecordWithdrawal>
        </ModuleActions>
      </ModuleHeading>

      <TransactionMetrics customerId={searchParams.customerId} />

      <TransactionFilters disabled={isPending}>
        <TransactionSearchFilter />
        <TransactionTypeFilter />
        <TransactionStatusFilter />
        <TransactionCustomerFilter />
        <TransactionClearFilters />
        <TransactionSortFilter />
      </TransactionFilters>
      <TransactionsTable transactions={transactions} isLoading={isPending} />
    </div>
  );
}
