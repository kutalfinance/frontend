import { useState } from "react";
import { Link } from "react-router";

import { ChevronDown, Mail, MapPin, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import type { Customer } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CustomerListItem({ customer }: { customer: Customer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-lg border">
      <div className="flex items-center justify-between p-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{customer.name}</h3>
          <p className="text-muted-foreground truncate text-sm">{customer.branch.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to={`/agent/customers/${customer.id}`}>View</Link>
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
        <div className="space-y-3 border-t pt-2">
          <div className="flex items-start gap-2 text-sm">
            <Phone className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs">Phone</p>
              <p>{customer.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <Mail className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs">Email</p>
              <p className="break-all">{customer.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs">Location</p>
              <p>{customer.location}</p>
            </div>
          </div>

          {customer.nextOfKin.name && (
            <div className="flex items-start gap-2 text-sm">
              <User className="text-muted-foreground mt-0.5 size-4 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Next of Kin</p>
                <p>{customer.nextOfKin.name}</p>
                {customer.nextOfKin.phoneNubmer && (
                  <p className="text-muted-foreground text-xs">{customer.nextOfKin.phoneNubmer}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
