import { Link, href } from "react-router";

import { Building2, MapPin, SquareArrowOutUpRight } from "lucide-react";

import { Loader } from "@/components/loader";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import type { Branch } from "@/lib/types";

export function BranchesGrid({ branches, isLoading }: { branches: Branch[]; isLoading: boolean }) {
  if (isLoading) {
    return <Loader />;
  }

  if (!branches.length) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 />
          </EmptyMedia>
          <EmptyTitle>No branches assigned</EmptyTitle>
          <EmptyDescription>You don't have any branches assigned to you yet.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {branches.map((branch) => (
        <Link to={href("/agent/branches/:branchId", { branchId: branch.id })}>
          <Card key={branch.id} className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                {branch.name} <SquareArrowOutUpRight className="text-muted-foreground size-4" />
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="size-4" />
                <span>{branch.location}</span>
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
