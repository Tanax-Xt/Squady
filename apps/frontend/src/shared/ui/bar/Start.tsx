"use client";

import { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils";

export interface BarStartProps extends ComponentProps<"div"> {}

const BarStart: React.FunctionComponent<BarStartProps> = ({
  className,
  ...otherProps
}) => {
  return (
    <div
      className={cn(
        "absolute left-2 flex items-center gap-1 [&>[data-slot=button]]:text-muted-foreground max-md:[&>[data-slot=button]]:text-base max-md:[&>[data-slot=button]]:[&>svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...otherProps}
    />
  );
};

export default BarStart;
