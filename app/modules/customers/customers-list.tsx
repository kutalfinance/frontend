import { Users } from "lucide-react";

import { Loader } from "@/components/loader";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import type { Customer } from "@/lib/types";

import { CustomerListItem } from "./customer-list-item";

export function CustomersList({
  customers,
  isLoading,
}: {
  customers: Customer[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Loader />;
  }

  if (customers.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>No customers found</EmptyTitle>
          <EmptyDescription>
            No customers match your search criteria. Try adjusting your filters.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-2">
      {customers.map((customer) => (
        <CustomerListItem key={customer.id} customer={customer} />
      ))}
    </div>
  );
}
