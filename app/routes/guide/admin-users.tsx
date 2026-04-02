import { Archive, Building2, Contact, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading, Paragraph } from "@/components/ui/text";

import { GuideNavigation, GuideTitle, Preview } from "./components";

export default function AdminUsersGuide() {
  return (
    <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
      <GuideTitle badge="Admin">Managing Users</GuideTitle>

      <p>
        The Users page is where you manage all system users — both Admins and Agents. From here you
        can create new users, search and filter the list, deactivate or restore accounts, and
        download agent reports.
      </p>

      {/* Page Header */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Page Overview</h3>
        <p>
          At the top of the page you'll see the heading with two action buttons, followed by summary
          metric cards.
        </p>
        <Preview wide>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <Heading variant="h2">User Management</Heading>
                <Paragraph className="text-muted-foreground text-sm">
                  Monitor key metrics and manage users.
                </Paragraph>
              </div>
              <div className="flex gap-2">
                <Button size="sm">
                  <Plus className="size-4" />
                  Add user
                </Button>
                <Button size="sm" variant="outline">
                  <Archive className="size-4" />
                </Button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Building2, label: "Branches", value: "5" },
                { icon: Contact, label: "Customers", value: "128" },
                { icon: Users, label: "Users", value: "12" },
              ].map((metric) => (
                <Card key={metric.label} className="gap-2">
                  <CardHeader>
                    <div className="w-fit rounded-md border p-2">
                      <metric.icon className="text-muted-foreground size-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Paragraph className="text-muted-foreground text-xs">{metric.label}</Paragraph>
                    <Heading variant="h3">{metric.value}</Heading>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Preview>

        <ul className="list-inside list-disc space-y-1 pl-1">
          <li>
            <strong>Add user</strong> — opens the create user form
          </li>
          <li>
            <strong>Archive icon</strong> — opens the deactivated users panel
          </li>
          <li>
            <strong>Metric cards</strong> — show total branches, customers, and users in the system
          </li>
        </ul>
      </div>

      <p className="text-muted-foreground italic">
        The remaining sections (creating users, filtering, user actions, and deactivated users) are
        coming soon.
      </p>

      <GuideNavigation />
    </div>
  );
}
