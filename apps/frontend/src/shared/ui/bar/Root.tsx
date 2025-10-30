"use client";

import { useScrolled } from "@/shared/hooks/use-scrolled";
import { cn } from "@/shared/lib/utils";

export interface BarRoot extends React.ComponentProps<"div"> {}

const BarRoot: React.FunctionComponent<BarRoot> = ({
  children,
  className,
  ...otherProps
}) => {
  const scrolled = useScrolled();

  return (
    <div
      className={cn("sticky top-0 z-10 h-13 w-full md:p-2", className)}
      {...otherProps}
    >
      <div
        className={cn(
          "flex h-13 w-full items-center justify-between border-b border-transparent bg-background/0 p-2 backdrop-blur-xl transition-[border-color,background-color-box-shadow,backdrop-filter] duration-75 max-md:top-0 md:rounded-md md:border md:text-sm",
          scrolled && "border-border bg-background/75 md:shadow-sm",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default BarRoot;
