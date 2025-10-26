import {
  GraduationCapIcon,
  HammerIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";

import { UserResponse, UserRole } from "@/shared/api";

import UserProfileCardBackgroundColor from "./UserProfileCardBackgroundColor";
import UserProfileCardBackgroundGradient from "./UserProfileCardBackgroundGradient";
import UserProfileCardBackgroundGrid from "./UserProfileCardBackgroundGrid";

const icons: Record<
  UserRole,
  React.ComponentType<React.ComponentProps<"svg">> | null
> = {
  admin: HammerIcon,
  agent: TrophyIcon,
  mentor: GraduationCapIcon,
  participant: UsersIcon,
} as const;

interface UserProfileCardBackgroundProps {
  user: UserResponse;
}

const UserProfileCardBackground: React.FunctionComponent<
  UserProfileCardBackgroundProps
> = ({ user }) => {
  const Icon = user.role ? icons[user.role] : null;

  return (
    <>
      <UserProfileCardBackgroundColor role={user.role} />

      {Icon && (
        <UserProfileCardBackgroundGrid
          icon={Icon}
          iconClass="text-neutral-300"
        />
      )}

      <UserProfileCardBackgroundGradient role={user.role} />
    </>
  );
};

export default UserProfileCardBackground;
