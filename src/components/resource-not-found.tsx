import { Link, type LinkProps } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Heading, Paragraph } from "@/components/ui/text";

interface ResourceNotFoundProps {
  resourceName: string;
  backTo: LinkProps["to"];
  backLabel?: string;
}

export function ResourceNotFound({ resourceName, backTo, backLabel }: ResourceNotFoundProps) {
  const defaultBackLabel = `Back to ${resourceName.toLowerCase()}s`;

  return (
    <div className="container py-20">
      <div className="mx-auto flex size-32">
        <img src="/empty-state.svg" className="text-muted-foreground size-full" />
      </div>

      <div className="grid place-items-center text-center">
        <Heading variant="h2">{resourceName} not found</Heading>
        <Paragraph>
          The {resourceName.toLowerCase()} you're looking for could not be found.
        </Paragraph>
        <Button asChild className="mt-4" variant="outline">
          <Link to={backTo}>{backLabel || defaultBackLabel}</Link>
        </Button>
      </div>
    </div>
  );
}

