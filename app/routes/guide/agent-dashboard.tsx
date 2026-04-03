import {
  ArrowUpDown,
  Building2,
  ChevronDown,
  Coins,
  Contact,
  MapPin,
  Phone,
  Plus,
  SearchIcon,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heading, Paragraph } from "@/components/ui/text";

import { GuideNavigation, GuideTitle, Preview } from "./components";

export default function AgentDashboardGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Agent" badgeVariant="accent">
        Dashboard
      </GuideTitle>

      <p>
        After logging in you land on the agent dashboard. This is your home page — it shows your
        assigned branch, a summary of your customers, and a list of all customers in your branch.
      </p>

      {/* Page Header */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Page Header</h3>
        <p>
          The header shows a personalised greeting, your branch name and location, and a button to
          add a new customer.
        </p>
        <Preview wide>
          <div className="flex items-center justify-between">
            <div>
              <Heading variant="h2">Welcome Kofi Mensah</Heading>
              <Paragraph className="text-muted-foreground flex items-center gap-1 text-sm">
                <MapPin className="size-4" />
                Kumasi Branch, Adum Kumasi
              </Paragraph>
            </div>
            <Button>
              <Plus className="size-4" /> Add customer
            </Button>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Add customer</strong> — opens the create customer form (see the Creating
            Customers guide)
          </li>
          <li>
            Your branch is assigned by an admin. If you don&apos;t see a branch, contact your admin.
          </li>
          <li>
            On mobile, the header and button stack vertically so the full greeting remains visible.
          </li>
        </ul>
      </div>

      {/* Summary Metric */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Summary Metric</h3>
        <p>A card below the header shows the total number of customers in your branch.</p>
        <Preview>
          <Card className="gap-2">
            <CardHeader>
              <div className="w-fit rounded-md border p-2">
                <Contact className="text-muted-foreground size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <Paragraph className="text-muted-foreground text-sm">Customers</Paragraph>
              <Heading>24</Heading>
            </CardContent>
          </Card>
        </Preview>
      </div>

      {/* Customer List */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Customer List</h3>
        <p>
          Below the metric is a searchable list of all customers in your branch. Each customer is
          shown as a collapsible card.
        </p>

        <h4 className="text-foreground text-sm font-medium">Search &amp; Sort</h4>
        <Preview wide>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input disabled placeholder="Search customers..." className="w-full pl-9" />
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Button size="icon" variant="ghost" disabled>
                <ArrowUpDown className="size-4" />
              </Button>
              <Button size="sm" variant="outline" disabled>
                Sort by: Created At
              </Button>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Search</strong> — filter by customer name, email, or phone number
          </li>
          <li>
            <strong>Sort by</strong> — sort by Name, Email, Location, or Created At
          </li>
          <li>
            <strong>Sort direction</strong> — toggle ascending or descending
          </li>
          <li>On mobile, the search bar takes the full width and the sort controls wrap below it.</li>
        </ul>

        <h4 className="text-foreground text-sm font-medium">Customer Card</h4>
        <p>
          Each card shows the customer&apos;s name and email. Click <strong>View contributions</strong>{" "}
          to see their transaction history, or expand the card to see more details.
        </p>
        <Preview wide>
          <div className="space-y-2">
            <div className="rounded-lg border">
              <div className="flex items-center justify-between p-4">
                <div>
                  <Heading variant="h4">Ama Darko</Heading>
                  <Paragraph className="text-muted-foreground text-sm">ama@mail.com</Paragraph>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" disabled>
                    <Coins className="size-4" /> View contributions
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    <ChevronDown className="size-4 rotate-180" />
                  </Button>
                </div>
              </div>

              {/* Expanded details */}
              <div className="space-y-3 border-t px-4 pt-4 pb-4">
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <div>
                    <Paragraph className="text-muted-foreground text-xs">Phone</Paragraph>
                    <Paragraph>024 555 1234</Paragraph>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Building2 className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <div>
                    <Paragraph className="text-muted-foreground text-xs">Branch</Paragraph>
                    <Paragraph>Kumasi Branch</Paragraph>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <div>
                    <Paragraph className="text-muted-foreground text-xs">Location</Paragraph>
                    <Paragraph>Adum Kumasi</Paragraph>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <User className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <div>
                    <Paragraph className="text-muted-foreground text-xs">Next of Kin</Paragraph>
                    <Paragraph>Kofi Darko</Paragraph>
                    <Paragraph className="text-muted-foreground text-sm">
                      kofi@mail.com
                    </Paragraph>
                    <Paragraph className="text-muted-foreground text-sm">020 123 4567</Paragraph>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsed card */}
            <div className="rounded-lg border">
              <div className="flex items-center justify-between p-4">
                <div>
                  <Heading variant="h4">Kofi Boateng</Heading>
                  <Paragraph className="text-muted-foreground text-sm">kofi.b@mail.com</Paragraph>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" disabled>
                    <Coins className="size-4" /> View contributions
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    <ChevronDown className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>View contributions</strong> — navigates to the customer details page showing
            their deposit and withdrawal history. On mobile, this button shows as just{" "}
            <strong>View</strong> to save space.
          </li>
          <li>
            <strong>Expand arrow</strong> — toggles extra details: phone, branch, location, and
            next of kin
          </li>
        </ul>
      </div>

      <GuideNavigation />
    </div>
  );
}
