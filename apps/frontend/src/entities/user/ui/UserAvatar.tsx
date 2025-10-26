"use client";

import { cva } from "class-variance-authority";

import { UserResponse } from "@/shared/api";
import Avatar from "@/shared/ui/avatar";

import { parseInitials } from "../lib/parseInitials";

const userAvatarVariants = cva("bg-gradient-to-b backdrop-blur-md", {
  variants: {
    role: {
      null: "from-gray-500/75 via-gray-600/75 to-gray-500/75 text-white ring-gray-400",
      admin:
        "from-red-500/75 via-red-600/75 to-red-500/75 text-white ring-red-400",
      agent:
        "from-yellow-500/75 via-yellow-600/75 to-yellow-500/75 text-white ring-yellow-400",
      mentor:
        "from-green-500/75 via-green-600/75 to-green-500/75 text-white ring-green-400",
      participant:
        "from-blue-500/75 via-blue-600/75 to-blue-500/75 text-white ring-blue-400",
    },
  },
  defaultVariants: {
    role: null,
  },
});

interface UserAvatarProps
  extends Omit<React.ComponentProps<typeof Avatar>, "children"> {
  user: UserResponse;
}

const UserAvatar: React.FunctionComponent<UserAvatarProps> = ({
  user,
  ...otherProps
}) => {
  return (
    <Avatar {...otherProps}>
      <Avatar.Image alt={user.username} draggable={false} />
      <Avatar.Fallback className={userAvatarVariants({ role: user.role })}>
        {parseInitials(user.username)}
      </Avatar.Fallback>
    </Avatar>
  );
};

export default UserAvatar;
