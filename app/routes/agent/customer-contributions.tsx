import { siteConfig } from "@/lib/config";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Route } from "./+types/customer-contributions";
import {
  contributionsQueryOptions,
  customerByIdQueryOptions,
  validateContributionsSearch,
} from "@/hooks/data/customers";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Loader } from "@/components/loader";
import { Coins } from "lucide-react";
import { data, href, Link, Outlet } from "react-router";
import type { Contribution } from "@/lib/types";
import { queryClient } from "@/components/query-provider";

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

  return (
    <div className="container">
      <Outlet />

      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={href("/agent")}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={href("/agent/branches/:branchId", { branchId: customer.branch.id })}>
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

      {isPending ? <Loader /> : <ContributionsList contributions={contributions} />}
    </div>
  );
}

function ContributionsList({ contributions }: { contributions: Contribution[] }) {
  if (!contributions.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Coins />
          </EmptyMedia>
          <EmptyTitle>No contributions found</EmptyTitle>
          <EmptyDescription>No contributions found. Try adjusting your filters.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-2">
      {contributions.map((contribution) => (
        <div key={contribution.id} className="rounded border p-4">
          <p className="text-muted-foreground text-sm">Amount: ${contribution.amount}</p>
          <p className="text-muted-foreground text-sm">
            Date: {new Date(contribution.timestamp).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
