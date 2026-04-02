import React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva("scroll-m-20 tracking-tight font-medium", {
  variants: {
    variant: {
      h1: "text-2xl",
      h2: "text-xl",
      h3: "text-lg",
      h4: "text-base",
    },
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof headingVariants> {}

const Heading = React.forwardRef<HTMLParagraphElement, HeadingProps>(
  ({ className, variant = "h1", ...props }, ref) => {
    const Comp = variant!;

    return <Comp className={cn(headingVariants({ variant, className }))} {...props} ref={ref} />;
  }
);

Heading.displayName = "Heading";

const Paragraph = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return <p className={cn("", className)} {...props} ref={ref} />;
});

Paragraph.displayName = "Paragraph";

const Kbd = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <kbd
        className={cn(
          "bg-muted shadow-border pointer-events-none items-center rounded border px-1.5 py-px text-xs shadow-[0_2px_0_1px_var(--border)]",
          className
        )}
        {...props}
        ref={ref}
      />
    );
  }
);

Kbd.displayName = "Kbd";

export { Kbd, Heading, Paragraph };
