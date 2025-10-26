import { cn } from "@/shared/lib/utils";

function SkeletonRoot({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  );
}

export { SkeletonRoot };

const Skeleton = SkeletonRoot;

export default Skeleton;
