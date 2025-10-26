"use client";

import { UserRole } from "@/shared/api";
import Badge from "@/shared/ui/badge";
import Tooltip from "@/shared/ui/tooltip";

import { getRoleDisplayName } from "../lib/getRoleDisplayName";
import UserProfileCardUnverifiedAgentIcon from "./icons/UserUnverifiedAgentIcon";
import UserProfileCardVerifiedAgentIcon from "./icons/UserVerifiedAgentIcon";

interface UserRoleBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "children" | "role"> {
  role: UserRole | null;
  is_verified_agent?: boolean | null | undefined;
}

const UserRoleBadge: React.FunctionComponent<UserRoleBadgeProps> = ({
  role,
  is_verified_agent,
  ...otherProps
}) => {
  const tooltipContent = is_verified_agent
    ? "Статус представителя олимпиады подтвержден администратором"
    : "Статус представителя олимпиады не подтвержден";

  return (
    <Badge
      variant="neutral"
      className="mx-auto mt-2.5 flex w-fit"
      {...otherProps}
    >
      {role === "agent" && is_verified_agent !== null && (
        <Tooltip>
          <Tooltip.Trigger
            onClick={(event) => event.preventDefault()}
            className="relative -m-1 -ms-1.5 me-1 size-4.5"
          >
            {is_verified_agent ? (
              <UserProfileCardVerifiedAgentIcon />
            ) : (
              <UserProfileCardUnverifiedAgentIcon />
            )}
            <span className="sr-only">{tooltipContent}</span>
          </Tooltip.Trigger>
          <Tooltip.Content
            side="bottom"
            onPointerDownOutside={(event) => event.preventDefault()}
          >
            {tooltipContent}
          </Tooltip.Content>
        </Tooltip>
      )}
      <span>{getRoleDisplayName(role)}</span>
    </Badge>
  );
};

export default UserRoleBadge;
