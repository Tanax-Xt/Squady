"use client";

import { cva } from "class-variance-authority";

import { UserResponse } from "@/shared/api";
import Avatar from "@/shared/ui/avatar";

import { parseInitials } from "../lib/parseInitials";

const userAvatarVariants = cva("font-semibold", {
  variants: {
    role: {
      null: "bg-gray-500 text-white ring-gray-400",
      admin: "bg-red-500 text-white ring-red-400",
      agent: "bg-yellow-500 text-white ring-yellow-400",
      mentor: "bg-green-500 text-white ring-green-400",
      participant: "bg-blue-500 text-white ring-blue-400",
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
