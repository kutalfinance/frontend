import * as React from "react";

import { Heading, Paragraph } from "@/components/ui/text";

import { cn } from "@/lib/utils";

function ModuleHeading({ className, ...props }: React.ComponentProps<"hgroup">) {
  return (
    <hgroup
      data-slot="module-heading"
      className={cn("container mb-6 flex flex-col", className)}
      {...props}
    />
  );
}

function ModuleHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="module-header"
      className={cn("flex min-h-10 justify-between gap-5", className)}
      {...props}
    />
  );
}

function ModuleTitle({ className, ...props }: React.ComponentProps<typeof Heading>) {
  return <Heading data-slot="module-title" className={className} {...props} />;
}

function ModuleDescription({ className, ...props }: React.ComponentProps<typeof Paragraph>) {
  return (
    <Paragraph data-slot="module-description" className={cn("max-w-lg", className)} {...props} />
  );
}

function ModuleActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="module-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

export { ModuleHeading, ModuleHeader, ModuleTitle, ModuleDescription, ModuleActions };
