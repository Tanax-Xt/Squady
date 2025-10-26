import { cva, VariantProps } from "class-variance-authority";

import { UserAvatar, UserRoleBadge } from "@/entities/user";
import { CurrentUserResponse, UserResponse } from "@/shared/api";

import UserProfileCardBackground from "./UserProfileCardBackground";

const userProfileCardVariants = cva(
  "relative isolate overflow-hidden rounded-md p-4 ring",
  {
    variants: {
      role: {
        null: "ring-gray-500",
        admin: "ring-red-500",
        agent: "ring-yellow-500",
        mentor: "ring-green-500",
        participant: "ring-blue-500",
      },
    },
    defaultVariants: {
      role: null,
    },
  },
);

type UserProfileCardVariantProps = VariantProps<typeof userProfileCardVariants>;

interface UserProfileCardProps extends React.ComponentProps<"div"> {
  user: UserResponse | CurrentUserResponse;
}

const UserProfileCard: React.FunctionComponent<UserProfileCardProps> = ({
  user,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={userProfileCardVariants({
        role: String(user.role) as UserProfileCardVariantProps["role"],
        className,
      })}
      {...otherProps}
    >
      <UserProfileCardBackground user={user} />

      <UserAvatar
        user={user}
        className="mx-auto mb-3 size-24 text-4xl font-semibold text-neutral-50"
      />

      <hgroup className="text-center">
        <h2 className="flex items-center justify-center gap-1 text-3xl font-semibold text-white md:text-2xl">
          <span>{user.username}</span>
        </h2>
        <p className="text-lg text-neutral-50 md:text-base">{user.email}</p>
      </hgroup>

      <UserRoleBadge
        role={user.role}
        is_verified_agent={user.is_verified_agent}
      />
    </div>
  );
};

export default UserProfileCard;
