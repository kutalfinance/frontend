import { Link, Outlet, data, href } from "react-router";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Building2,
  ChevronDown,
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

import { contributionsQueryOptions, validateContributionsSearch } from "@/hooks/data/contributions";
import { customerByIdQueryOptions } from "@/hooks/data/customers";
import { siteConfig } from "@/lib/config";
import {
  AgentRecordDeposit,
  AgentRecordWithdrawal,
} from "@/modules/contributions/agent-contribution-create";
import {
  ContributionClearFilters,
  ContributionFilters,
  ContributionSearchFilter,
  ContributionSortFilter,
  ContributionTypeFilter,
} from "@/modules/contributions/contribution-filters";
import { ContributionMetrics } from "@/modules/contributions/contribution-metrics";
import { ContributionsTable } from "@/modules/contributions/contributions-table";

import type { Route } from "./+types/customer-details";

export function meta() {
  return [
    { title: `Customer Contributions - ${siteConfig.name}` },
    { name: "description", content: "View and manage customer contributions" },
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
    const validatedParams = validateContributionsSearch.parse(searchParams);
    return { searchParams: validatedParams };
  } catch {
    return { searchParams: {} };
  }
}

export default function CustomerContributions({ loaderData, params }: Route.ComponentProps) {
  const { data: customerResponse } = useSuspenseQuery(customerByIdQueryOptions(params.customerId));
  const customer = customerResponse.data;

  const { searchParams } = loaderData;
  const { data, isPending } = useQuery(contributionsQueryOptions({ searchParams }));
  const contributions = data?.data || [];

  const customerInfo = [
    { icon: Phone, label: "Phone Number", value: customer.phoneNumber },
    { icon: Mail, label: "Email", value: customer.email },
    { icon: MapPin, label: "Location", value: customer.location },
    { icon: Building2, label: "Branch", value: customer.branch.name },
  ];

  return (
    <div className="container space-y-10">
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
            <BreadcrumbLink asChild>
              <Link to={href("/agent/branches/:branchId", { branchId: params.branchId })}>
                {customer.branch.name}
              </Link>
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
              <PopoverContent>
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
          <ModuleDescription>View customer details and contribution history</ModuleDescription>
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

      <ContributionMetrics customerId={customer.id} />

      {/* Contributions Section */}
      <div className="space-y-3">
        <Heading variant="h3">Contributions History</Heading>

        <ContributionFilters disabled={isPending}>
          <ContributionSearchFilter />
          <ContributionTypeFilter />
          <ContributionClearFilters />
          <ContributionSortFilter />
        </ContributionFilters>

        <ContributionsTable contributions={contributions} isLoading={isPending} />
      </div>
    </div>
  );
}
