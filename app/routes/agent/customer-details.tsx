import { Link, Outlet, data, href } from "react-router";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Building2,
  Calendar,
  ChevronDown,
  DollarSign,
  Hash,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import {
  ModuleActions,
  ModuleDescription,
  ModuleHeader,
  ModuleHeading,
  ModuleTitle,
} from "@/components/module-heading";
import { queryClient } from "@/components/query-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heading, Paragraph } from "@/components/ui/text";

import { customerByIdQueryOptions } from "@/hooks/data/customers";
import { transactionsQueryOptions, validateTransactionsSearch } from "@/hooks/data/transactions";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/utils/money";
import {
  AgentRecordDeposit,
  AgentRecordWithdrawal,
} from "@/modules/transactions/agent-transaction-create";
import {
  TransactionClearFilters,
  TransactionFilters,
  TransactionSearchFilter,
  TransactionSortFilter,
  TransactionStatusFilter,
  TransactionTypeFilter,
} from "@/modules/transactions/transaction-filters";
import { TransactionMetrics } from "@/modules/transactions/transaction-metrics";
import { TransactionsTable } from "@/modules/transactions/transactions-table";

import type { Route } from "./+types/customer-details";

export function meta() {
  return [
    { title: `Customer Transactions - ${siteConfig.name}` },
    { name: "description", content: "View and manage customer transactions" },
  ];
}

export async function clientLoader({ request, params }: Route.ClientLoaderArgs) {
  try {
    await queryClient.ensureQueryData(customerByIdQueryOptions(params.customerId));
  } catch (err) {
    throw data("Customer not found", { status: 404 });
  }

  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams);

  try {
    searchParams.customerId = params.customerId;
    const validatedParams = validateTransactionsSearch.parse(searchParams);
    return { searchParams: validatedParams };
  } catch (error) {
    console.error("Failed to validate search params:", error);
    return { searchParams: {} };
  }
}

export default function CustomerTransactions({ loaderData, params }: Route.ComponentProps) {
  const { data: customerResponse } = useSuspenseQuery(customerByIdQueryOptions(params.customerId));
  const customer = customerResponse.data;

  const { searchParams } = loaderData;
  const { data, isPending } = useQuery(transactionsQueryOptions({ searchParams }));
  const transactions = data?.data ?? [];

  const customerInfo = [
    { icon: Hash, label: "Account Number", value: customer.accountNumber },
    {
      icon: DollarSign,
      label: "Contribution Amount",
      value: formatMoney(customer.contributionAmount),
    },
    { icon: Phone, label: "Phone Number", value: customer.phoneNumber },
    { icon: Mail, label: "Email", value: customer.email },
    { icon: MapPin, label: "Location", value: customer.location },
    { icon: Building2, label: "Branch", value: customer.branch.name },
    {
      icon: Calendar,
      label: "Registration Date",
      value: customer.registrationDate
        ? new Date(customer.registrationDate).toLocaleDateString("en-GB")
        : "-",
    },
    {
      icon: Calendar,
      label: "Last Deposit",
      value: customer.lastDepositDate
        ? new Date(customer.lastDepositDate).toLocaleDateString("en-GB")
        : "-",
    },
  ];

  return (
    <div className="container space-y-6">
      <Outlet />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={href("/agent")}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{customer.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ModuleHeading>
        <ModuleHeader>
          <div className="flex items-center gap-2">
            <ModuleTitle>{customer.name}</ModuleTitle>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,auto))] gap-4">
                  {customerInfo.map((field) => (
                    <div key={field.label} className="flex items-start gap-2">
                      <field.icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                      <div>
                        <Paragraph className="text-muted-foreground text-sm">
                          {field.label}
                        </Paragraph>
                        <Heading variant="h4">{field.value}</Heading>
                      </div>
                    </div>
                  ))}

                  {customer.nextOfKin.name && (
                    <div className="flex items-start gap-2">
                      <User className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                      <div>
                        <Paragraph className="text-muted-foreground text-sm">Next of Kin</Paragraph>
                        <Heading variant="h4">{customer.nextOfKin.name}</Heading>
                        {customer.nextOfKin.phoneNumber && (
                          <Paragraph className="text-muted-foreground text-sm">
                            {customer.nextOfKin.phoneNumber}
                          </Paragraph>
                        )}
                        {customer.nextOfKin.email && (
                          <Paragraph className="text-muted-foreground text-sm">
                            {customer.nextOfKin.email}
                          </Paragraph>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <ModuleDescription>View customer details and transaction history</ModuleDescription>
        </ModuleHeader>
        <ModuleActions>
          <AgentRecordDeposit asChild customer={customer}>
            <Button>
              <BanknoteArrowUp /> Record deposit
            </Button>
          </AgentRecordDeposit>
          <AgentRecordWithdrawal asChild customer={customer}>
            <Button variant="destructive-outline">
              <BanknoteArrowDown /> Record withdrawal
            </Button>
          </AgentRecordWithdrawal>
        </ModuleActions>
      </ModuleHeading>

      <TransactionMetrics customerId={customer.id} />

      {/* Transactions Section */}
      <div className="space-y-3">
        <Heading variant="h3">Transactions History</Heading>

        <TransactionFilters disabled={isPending}>
          <TransactionSearchFilter />
          <TransactionTypeFilter />
          <TransactionStatusFilter />
          <TransactionClearFilters />
          <TransactionSortFilter />
        </TransactionFilters>

        <TransactionsTable transactions={transactions} isLoading={isPending} />
      </div>
    </div>
  );
}
