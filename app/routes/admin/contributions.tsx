import { Outlet } from "react-router";

import { useQuery } from "@tanstack/react-query";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";

import { contributionsQueryOptions, validateContributionsSearch } from "@/hooks/data/customers";
import { siteConfig } from "@/lib/config";
import { ContributionsTable } from "@/modules/customers/contributions-table";

import type { Route } from "./+types/contributions";
import { Button } from "@/components/ui/button";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import {
  AdminRecordDeposit,
  AdminRecordWithdrawal,
} from "@/modules/customers/admin-contribution-create";

export function meta() {
  return [
    { title: `Contributions - ${siteConfig.name}` },
    { name: "description", content: "View all customer contributions" },
  ];
}

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  try {
    const validatedParams = validateContributionsSearch.parse(params);
    return { searchParams: validatedParams };
  } catch {
    return { searchParams: {} };
  }
}

export default function Contributions({ loaderData }: Route.ComponentProps) {
  const { searchParams } = loaderData;
  const { data, isPending } = useQuery(contributionsQueryOptions({ searchParams }));
  const contributions = data?.data ?? [];

  return (
    <div className="container">
      <Outlet />

      <ModuleHeading>
        <ModuleHeader>
          <ModuleTitle>Contributions</ModuleTitle>
          <ModuleDescription>
            View all customer contributions, deposits, and withdrawals across all branches
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

      <ContributionsTable contributions={contributions} isLoading={isPending} />
    </div>
  );
}
