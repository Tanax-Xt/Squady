import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs selection:bg-accent selection:text-accent-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-card shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs backdrop-blur-lg hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      rounded: {
        md: "rounded-md",
        full: "rounded-full",
      },
      loading: {
        true: "",
        false: "",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 px-1.5 has-[>svg]:px-2",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
      stretched: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      rounded: "md",
      size: "default",
    },
  },
);

export type ButtonProps = Omit<React.ComponentProps<"button">, "value"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button: React.FunctionComponent<ButtonProps> = ({
  asChild,
  variant,
  size,
  rounded,
  loading,
  stretched,
  disabled,
  className,
  ...otherProps
}) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      disabled={disabled || loading === true}
      className={buttonVariants({
        variant,
        size,
        rounded,
        loading,
        stretched,
        className,
      })}
      aria-busy={loading ? "true" : undefined}
      {...otherProps}
    />
  );
};

export { buttonVariants };

export default Button;
