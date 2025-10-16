import { Link, href } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

interface ResourceNotFoundProps {
  resourceName: string;
  backTo: Parameters<typeof href>[0];
  backLabel?: string;
}

export function ResourceNotFound({ resourceName, backTo, backLabel }: ResourceNotFoundProps) {
  const defaultBackLabel = `Back to ${resourceName.toLowerCase()}s`;

  return (
    <div className="container py-20">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{resourceName} not found</EmptyTitle>
          <EmptyDescription>
            The {resourceName.toLowerCase()} you're looking for could not be found.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline">
            <Link to={backTo}>{backLabel || defaultBackLabel}</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
