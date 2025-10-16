import { useNavigate } from "react-router";

import { format } from "date-fns";
import { Mail, MapPin, Phone, User } from "lucide-react";

import { queryClient } from "@/components/query-provider";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Heading, Paragraph } from "@/components/ui/text";

import { customerByIdQueryOptions } from "@/hooks/data/customers";
import { siteConfig } from "@/lib/config";

import type { Route } from "./+types/customer-details";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const data = await queryClient.ensureQueryData(customerByIdQueryOptions(params.customerId));
  return { customer: data.data };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = `${loaderData?.customer.name ?? "Customer not found"} - ${siteConfig.name}`;

  return [{ title }, { name: "description", content: "View customer information" }];
}

export default function CustomerDetails({ loaderData }: Route.ComponentProps) {
  const { customer } = loaderData;
  const navigate = useNavigate();

  return (
    <Sheet open onOpenChange={() => navigate(-1)}>
      <SheetContent className="w-full sm:max-w-screen-lg">
        <SheetHeader>
          <SheetTitle>{customer.name}</SheetTitle>
        </SheetHeader>

        <div className="container space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Customer Information */}
            <div className="space-y-6 lg:col-span-2">
              <CustomerInfoCard customer={customer} />
              <ContributionsCard customerId={customer.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <NextOfKinCard nextOfKin={customer.nextOfKin} />
              <BranchInfoCard branch={customer.branch} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CustomerInfoCard({ customer }: { customer: any }) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <Heading variant="h4" className="mb-4">
        Customer Information
      </Heading>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <User className="text-muted-foreground h-4 w-4" />
          <div>
            <Paragraph className="text-muted-foreground text-sm">Full Name</Paragraph>
            <Paragraph>{customer.name}</Paragraph>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="text-muted-foreground h-4 w-4" />
          <div>
            <Paragraph className="text-muted-foreground text-sm">Email</Paragraph>
            <Paragraph>{customer.email}</Paragraph>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-muted-foreground h-4 w-4" />
          <div>
            <Paragraph className="text-muted-foreground text-sm">Phone Number</Paragraph>
            <Paragraph>{customer.phoneNumber}</Paragraph>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="text-muted-foreground h-4 w-4" />
          <div>
            <Paragraph className="text-muted-foreground text-sm">Location</Paragraph>
            <Paragraph>{customer.location}</Paragraph>
          </div>
        </div>

        <div className="sm:col-span-2">
          <Paragraph className="text-muted-foreground text-sm">Member Since</Paragraph>
          <Paragraph>{format(new Date(customer.createdAt), "MMMM dd, yyyy 'at' h:mm a")}</Paragraph>
        </div>
      </div>
    </div>
  );
}

function NextOfKinCard({ nextOfKin }: { nextOfKin: any }) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <Heading variant="h4" className="mb-4">
        Next of Kin
      </Heading>
      <div className="space-y-3">
        <div>
          <Paragraph className="text-muted-foreground text-sm">Name</Paragraph>
          <Paragraph>{nextOfKin.name}</Paragraph>
        </div>

        <div>
          <Paragraph className="text-muted-foreground text-sm">Phone Number</Paragraph>
          <Paragraph>{nextOfKin.phoneNubmer}</Paragraph>
        </div>

        <div>
          <Paragraph className="text-muted-foreground text-sm">Email</Paragraph>
          <Paragraph>{nextOfKin.email}</Paragraph>
        </div>
      </div>
    </div>
  );
}

function BranchInfoCard({ branch }: { branch: { id: string; name: string } }) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <Heading variant="h4" className="mb-4">
        Branch Information
      </Heading>
      <div>
        <Paragraph className="text-muted-foreground text-sm">Branch name</Paragraph>
        <Paragraph>{branch.name}</Paragraph>
      </div>
    </div>
  );
}

function ContributionsCard({}: { customerId: string }) {
  // TODO: Implement contributions hook when contributions API is ready
  const contributions: any[] = []; // Placeholder

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <Heading variant="h4">Contributions</Heading>
        <Badge variant="secondary">{contributions.length} Total</Badge>
      </div>

      {contributions.length === 0 ? (
        <div className="py-8 text-center">
          <Paragraph className="text-muted-foreground">
            No contributions found for this customer.
          </Paragraph>
        </div>
      ) : (
        <div className="space-y-2">
          {contributions.map((contribution, index) => (
            <div key={index} className="flex items-center justify-between rounded border p-3">
              <div>
                <Paragraph className="font-medium">₦{contribution.amount}</Paragraph>
                <Paragraph className="text-muted-foreground text-sm">
                  {format(new Date(contribution.date), "MMM dd, yyyy")}
                </Paragraph>
              </div>
              <Badge variant={contribution.status === "completed" ? "default" : "secondary"}>
                {contribution.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
