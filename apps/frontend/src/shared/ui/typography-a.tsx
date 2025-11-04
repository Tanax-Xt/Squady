"use client";

import { Slot } from "@radix-ui/react-slot";

import { cn } from "../lib/utils";

export function TypographyA({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-1 text-primary underline-offset-4 outline-none hover:underline focus-visible:underline",
        className,
      )}
      {...props}
    />
  );
}
