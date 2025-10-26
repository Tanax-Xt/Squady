"use client";

import { useScrolled } from "@/shared/hooks/use-scrolled";
import { cn } from "@/shared/lib/utils";

export interface BarCenterProps extends React.ComponentProps<"div"> {
  showAfterScrolled?: boolean;
}

const BarCenter: React.FunctionComponent<BarCenterProps> = ({
  showAfterScrolled,
  className,
  ...otherProps
}) => {
  const scrolled = useScrolled();

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 font-semibold",
        showAfterScrolled && "opacity-0 transition-opacity",
        showAfterScrolled && scrolled && "opacity-100",
        className,
      )}
      {...otherProps}
    />
  );
};

export default BarCenter;
