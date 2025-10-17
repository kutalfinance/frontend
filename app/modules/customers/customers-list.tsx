import { Building2, Users } from "lucide-react";
import { useState } from "react";
import { href, Link } from "react-router";
import { ChevronDown, Coins, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Customer } from "@/lib/types";
import { Heading, Paragraph } from "@/components/ui/text";

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

  if (!customers.length) {
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

export function CustomerListItem({ customer }: { customer: Customer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-lg border">
      <div className="flex items-center justify-between p-4">
        <div className="min-w-0 flex-1">
          <Heading variant="h4" className="truncate">
            {customer.name}
          </Heading>
          <Paragraph className="text-muted-foreground truncate text-sm">{customer.email}</Paragraph>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link
              to={href("/agent/branches/:branchId/customers/:customerId", {
                branchId: customer.branch.id,
                customerId: customer.id,
              })}
            >
              <Coins />
              <span>
                View<span className="hidden sm:inline">&nbsp;contributions</span>
              </span>
            </Link>
          </Button>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
              <span className="sr-only">Toggle details</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-start gap-2 text-sm">
            <Phone className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <Paragraph className="text-muted-foreground text-xs">Phone</Paragraph>
              <Paragraph>{customer.phoneNumber}</Paragraph>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <Building2 className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <Paragraph className="text-muted-foreground text-xs">Branch</Paragraph>
              <Paragraph className="break-all">{customer.branch.name}</Paragraph>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <Paragraph className="text-muted-foreground text-xs">Location</Paragraph>
              <Paragraph>{customer.location}</Paragraph>
            </div>
          </div>

          {customer.nextOfKin.name && (
            <div className="flex items-start gap-2 text-sm">
              <User className="text-muted-foreground mt-0.5 size-4 shrink-0" />
              <div>
                <Paragraph className="text-muted-foreground text-xs">Next of Kin</Paragraph>
                <Paragraph>{customer.nextOfKin.name}</Paragraph>
                {customer.nextOfKin.phoneNubmer && (
                  <Paragraph className="text-muted-foreground text-xs">
                    {customer.nextOfKin.phoneNubmer}
                  </Paragraph>
                )}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
