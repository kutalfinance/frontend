import { Link, createFileRoute } from "@tanstack/react-router";

import { Shield, Users } from "lucide-react";

import { AppLogo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import { Paragraph } from "@/components/ui/text";

export const Route = createFileRoute("/auth/")({
  component: AuthHome,
});

function AuthHome() {
  return (
    <>
      <hgroup className="flex flex-col">
        <AppLogo />
        <Paragraph className="text-muted-foreground">
          Select your account type to proceed.
        </Paragraph>
      </hgroup>

      <div className="space-y-3">
        <Button asChild className="w-full">
          <Link to="/auth/agent/login">
            <Users />
            Agent login
          </Link>
        </Button>

        <Button asChild variant="outline" className="w-full">
          <Link to="/auth/admin/login">
            <Shield />
            Administrator login
          </Link>
        </Button>
      </div>
    </>
  );
}
