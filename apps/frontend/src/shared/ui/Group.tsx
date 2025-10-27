import { tv, VariantProps } from "tailwind-variants";

export const group = tv({
  base: [
    "relative flex w-full flex-col overflow-hidden rounded-md border bg-card text-card-foreground",
  ],
  variants: {
    divide: {
      true: "divide-y-border divide-y",
    },
  },
  defaultVariants: {
    divide: true,
  },
});

export interface GroupProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof group> {}

const Group: React.FunctionComponent<GroupProps> = ({
  divide,
  className,
  ...otherProps
}) => {
  return <div className={group({ divide, className })} {...otherProps} />;
};

export default Group;
