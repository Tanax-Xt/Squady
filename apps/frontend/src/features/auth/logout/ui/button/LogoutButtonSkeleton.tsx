import { cn } from "@/shared/lib/utils";
import Skeleton from "@/shared/ui/skeleton";

export interface LogoutButtonSkeletonProps
  extends Omit<React.ComponentProps<typeof Skeleton>, "children"> {}

const LogoutButtonSkeleton: React.FunctionComponent<
  LogoutButtonSkeletonProps
> = ({ className, ...otherProps }) => {
  return (
    <Skeleton
      className={cn(
        "h-10 w-full bg-accent/75 ring ring-accent max-md:mt-auto",
        className,
      )}
      {...otherProps}
    />
  );
};

export default LogoutButtonSkeleton;
