import { Link, href } from "react-router";

import { Building2, ChevronRight, MapPin } from "lucide-react";

import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Paragraph } from "@/components/ui/text";

import type { Branch } from "@/lib/types";

export function BranchesGrid({ branches, isLoading }: { branches: Branch[]; isLoading: boolean }) {
  if (isLoading) {
    return <Loader />;
  }

  if (!branches.length) {
    return (
      <Empty>
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
    <div className="grid gap-6 gap-x-20 sm:grid-cols-2">
      {branches.map((branch) => (
        <Link
          to={href("/agent/branches/:branchId", { branchId: branch.id })}
          key={branch.id}
          className="group flex justify-between"
        >
          <div>
            <Paragraph>{branch.name}</Paragraph>
            <Paragraph className="text-muted-foreground flex items-center gap-1">
              <MapPin className="size-4" />
              <span>{branch.location}</span>
            </Paragraph>
          </div>

          <Button size="icon" variant="ghost" className="group-hover:bg-accent">
            <ChevronRight className="size-4" />
          </Button>
        </Link>
      ))}
    </div>
  );
}
