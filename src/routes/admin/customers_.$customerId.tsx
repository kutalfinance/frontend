import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { format } from "date-fns";
import { ArrowLeft, Mail, MapPin, Phone, User } from "lucide-react";

import { Loader } from "@/components/loader";
import { queryClient } from "@/components/query-provider";
import { ResourceNotFound } from "@/components/resource-not-found";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading, Paragraph } from "@/components/ui/text";

import { customerByIdQueryOptions } from "@/hooks/data/customers";

export const Route = createFileRoute("/admin/customers_/$customerId")({
  loader: ({ params }) => queryClient.ensureQueryData(customerByIdQueryOptions(params.customerId)),
  component: CustomerDetails,
  pendingComponent: Loader,
  errorComponent: () => <ResourceNotFound resourceName="Customer" backTo="/admin/customers" />,
});

function CustomerDetails() {
  const { data: customer } = Route.useLoaderData();

  return (
    <div className="container space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link to="/admin/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <Heading>{customer.name}</Heading>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Information */}
        <div className="space-y-6 lg:col-span-2">
          <CustomerInfoCard customer={customer} />
          <ContributionsCard customerId={customer.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <NextOfKinCard nextOfKin={customer.nextOfKin} />
          <BranchInfoCard branchName={customer.branchName} />
        </div>
      </div>
    </div>
  );
}

function CustomerInfoCard({ customer }: { customer: any }) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <Heading className="mb-4">Customer Information</Heading>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <User className="text-muted-foreground h-4 w-4" />
          <div>
            <Paragraph className="text-muted-foreground text-sm">Full Name</Paragraph>
            <Paragraph className="font-medium">{customer.name}</Paragraph>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="text-muted-foreground h-4 w-4" />
          <div>
            <Paragraph className="text-muted-foreground text-sm">Email</Paragraph>
            <Paragraph className="font-medium">{customer.email}</Paragraph>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-muted-foreground h-4 w-4" />
          <div>
            <Paragraph className="text-muted-foreground text-sm">Phone Number</Paragraph>
            <Paragraph className="font-medium">{customer.phoneNumber}</Paragraph>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="text-muted-foreground h-4 w-4" />
          <div>
            <Paragraph className="text-muted-foreground text-sm">Location</Paragraph>
            <Paragraph className="font-medium">{customer.location}</Paragraph>
          </div>
        </div>

        <div className="sm:col-span-2">
          <Paragraph className="text-muted-foreground text-sm">Member Since</Paragraph>
          <Paragraph className="font-medium">
            {format(new Date(customer.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
          </Paragraph>
        </div>
      </div>
    </div>
  );
}

function NextOfKinCard({ nextOfKin }: { nextOfKin: any }) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <Heading className="mb-4">Next of Kin</Heading>
      <div className="space-y-3">
        <div>
          <Paragraph className="text-muted-foreground text-sm">Name</Paragraph>
          <Paragraph className="font-medium">{nextOfKin.name}</Paragraph>
        </div>

        <div>
          <Paragraph className="text-muted-foreground text-sm">Phone Number</Paragraph>
          <Paragraph className="font-medium">{nextOfKin.phoneNubmer}</Paragraph>
        </div>

        <div>
          <Paragraph className="text-muted-foreground text-sm">Email</Paragraph>
          <Paragraph className="font-medium">{nextOfKin.email}</Paragraph>
        </div>
      </div>
    </div>
  );
}

function BranchInfoCard({ branchName }: { branchName: string }) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <Heading className="mb-4">Branch Information</Heading>
      <div>
        <Paragraph className="text-muted-foreground text-sm">Assigned Branch</Paragraph>
        <Badge variant="outline" className="mt-1">
          {branchName || "No Branch Assigned"}
        </Badge>
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
        <Heading>Contributions</Heading>
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
