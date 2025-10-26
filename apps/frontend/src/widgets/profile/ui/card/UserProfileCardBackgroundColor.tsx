import { cva, VariantProps } from "class-variance-authority";

import { UserRole } from "@/shared/api";

const userProfileCardBackgroundColorVariants = cva("absolute inset-0 -z-20", {
  variants: {
    role: {
      null: "bg-gray-600",
      admin: "bg-red-600",
      agent: "bg-yellow-600",
      mentor: "bg-green-600",
      participant: "bg-blue-600",
    },
  },
  defaultVariants: {
    role: null,
  },
});

type UserProfileCardBackgroundColorVariantProps = VariantProps<
  typeof userProfileCardBackgroundColorVariants
>;

interface UserProfileCardBackgroundColorProps
  extends Omit<React.ComponentProps<"div">, "children" | "role"> {
  role: UserRole | null;
}

const UserProfileCardBackgroundColor: React.FunctionComponent<
  UserProfileCardBackgroundColorProps
> = ({ role, className, ...otherProps }) => {
  return (
    <div
      className={userProfileCardBackgroundColorVariants({
        role: String(
          role,
        ) as UserProfileCardBackgroundColorVariantProps["role"],
        className,
      })}
      {...otherProps}
    />
  );
};

export default UserProfileCardBackgroundColor;
