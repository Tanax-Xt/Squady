import { ClassValue, tv, type VariantProps } from "tailwind-variants";

export const badge = tv(
  {
    base: ["inline-flex items-center border py-0.5 font-semibold transition"],
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
      },
      shape: {
        rounded: "rounded-md px-2.5",
        circle: "rounded-full px-2",
      },
      variant: {
        default:
          "cursor-default border-transparent bg-primary text-primary-foreground shadow selection:bg-accent selection:text-accent-foreground",
        neutral:
          "cursor-default border-transparent bg-neutral-50 text-neutral-950 selection:bg-neutral-950 selection:text-neutral-50",
        secondary: "cursor-default bg-secondary text-secondary-foreground",
        card: "cursor-default bg-card text-card-foreground",
        "primary-action":
          "cursor-pointer bg-card text-primary outline-none hover:bg-accent focus-visible:bg-secondary/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        destructive:
          "text-destructive-foreground cursor-default border-transparent bg-destructive shadow",
        outline: "text-foreground∏ cursor-default",
      },
    },
    defaultVariants: {
      size: "xs",
      shape: "rounded",
      variant: "default",
    },
  },
  { twMerge: true },
);

export type BadgeProps<T extends React.ElementType> = Omit<
  React.ComponentProps<T>,
  "className"
> &
  VariantProps<typeof badge> & {
    as?: T;
    className?: ClassValue;
  };

const Badge = <T extends React.ElementType = "div">({
  className,
  size,
  shape,
  variant,
  as,
  ...otherProps
}: BadgeProps<T>): React.ReactNode => {
  const Component = as ?? "div";

  return (
    <Component
      className={badge({ size, shape, variant, className })}
      {...otherProps}
    />
  );
};

export default Badge;
