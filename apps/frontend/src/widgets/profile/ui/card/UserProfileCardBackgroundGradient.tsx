import { cva, VariantProps } from "class-variance-authority";

import { UserRole } from "@/shared/api";

const userProfileCardBackgroundGradientVariants = cva(
  "absolute inset-0 -z-10 before:absolute before:inset-0 before:overflow-hidden before:rounded-md before:backdrop-blur-[4px] before:[mask:radial-gradient(ellipse_at_center_5rem,transparent_25%,black_75%)] after:absolute after:inset-0 after:overflow-hidden after:rounded-md",
  {
    variants: {
      role: {
        admin:
          "after:bg-[radial-gradient(ellipse_at_center_5rem,transparent_25%,theme(colors.red.600)_75%)]",
        agent:
          "after:bg-[radial-gradient(ellipse_at_center_5rem,transparent_25%,theme(colors.yellow.600)_75%)]",
        mentor:
          "after:bg-[radial-gradient(ellipse_at_center_5rem,transparent_25%,theme(colors.green.600)_75%)]",
        participant:
          "after:bg-[radial-gradient(ellipse_at_center_5rem,transparent_25%,theme(colors.blue.600)_75%)]",
        null: "after:bg-[radial-gradient(ellipse_at_center_5rem,transparent_25%,theme(colors.gray.600)_75%)]",
      },
    },
    defaultVariants: {
      role: null,
    },
  },
);

type UserProfileCardBackgroundGradientVariantProps = VariantProps<
  typeof userProfileCardBackgroundGradientVariants
>;

interface UserProfileCardBackgroundGradientProps
  extends Omit<React.ComponentProps<"div">, "children" | "role"> {
  role: UserRole | null;
}

const UserProfileCardBackgroundGradient: React.FunctionComponent<
  UserProfileCardBackgroundGradientProps
> = ({ role, className, ...otherProps }) => {
  return (
    <div
      className={userProfileCardBackgroundGradientVariants({
        role: String(
          role,
        ) as UserProfileCardBackgroundGradientVariantProps["role"],
        className,
      })}
      {...otherProps}
    />
  );
};

export default UserProfileCardBackgroundGradient;
