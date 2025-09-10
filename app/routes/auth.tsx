import { type MetaFunction } from "react-router";
import { Link } from "react-router";

import { Shield, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading, Paragraph } from "@/components/ui/text";

export const meta: MetaFunction = () => {
  return [];
};

export default function AuthHome() {
  return (
    <>
      <hgroup className="flex flex-col">
        <Heading className="mt-4">Welcome Back</Heading>
        <Paragraph className="text-muted-foreground">
          Select your account type to proceed.
        </Paragraph>
      </hgroup>

      <div className="space-y-3">
        <Button asChild className="w-full">
          <Link to="#" /* to="/auth/agent/login" */>
            <Users />
            Agent Login
          </Link>
        </Button>

        <Button asChild variant="outline" className="w-full">
          <Link to="/auth/admin/login">
            <Shield />
            Administrator Login
          </Link>
        </Button>
      </div>
    </>
  );
}
