"use client";

import { cn } from "@/shared/lib/utils";

export interface BarEndProps extends React.ComponentProps<"div"> {}

const BarEnd: React.FunctionComponent<BarEndProps> = ({
  className,
  ...otherProps
}) => {
  return (
    <div
      className={cn(
        "absolute right-2 flex items-center gap-1 [&>[data-slot=button]]:text-muted-foreground max-md:[&>[data-slot=button]]:text-base max-md:[&>[data-slot=button]]:[&>svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...otherProps}
    />
  );
};

export default BarEnd;
