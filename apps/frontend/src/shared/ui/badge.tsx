import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex cursor-default items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow selection:bg-accent selection:text-accent-foreground",
        neutral:
          "border-transparent bg-neutral-50 text-neutral-950 selection:bg-neutral-950 selection:text-neutral-50",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "text-destructive-foreground border-transparent bg-destructive shadow",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };

export default Badge;
