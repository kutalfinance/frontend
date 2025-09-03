import { Link, Outlet } from "react-router";

import { Protected } from "@/components/protected";
import { Button } from "@/components/ui/button";
import { Heading, Paragraph } from "@/components/ui/text";

export default function Customers() {
  return (
    <div>
      <hgroup className="flex flex-col">
        <div className="flex justify-between gap-5">
          <Heading>Customer Management</Heading>

          <Protected action="customers:create">
            <Button asChild>
              <Link to="/customers/create">Create New Customer</Link>
            </Button>
          </Protected>
        </div>
        <Paragraph className="max-w-lg">
          Manage customer accounts and information. Create new customers, view their details, and
          track customer interactions.
        </Paragraph>
      </hgroup>

      <Outlet />
    </div>
  );
}

