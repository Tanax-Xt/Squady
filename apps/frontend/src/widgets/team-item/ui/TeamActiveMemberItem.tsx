import { UserXIcon } from "lucide-react";

import { kickMemberFromTeam } from "@/features/team/kick-member";
import { MemberResponse, TeamResponse } from "@/shared/api";
import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";

import { TeamMemberItem } from "./TeamMemberItem";

export function TeamActiveMemberItem({
  team,
  member,
  ...props
}: React.ComponentProps<typeof TeamMemberItem> & {
  team: TeamResponse;
  member: MemberResponse;
}) {
  const kick = kickMemberFromTeam.bind(null, team.id, member.id);

  return (
    <TeamMemberItem
      team={team}
      member={member}
      dropdownItems={
        <DropdownMenuItem
          variant="destructive"
          onSelect={kick}
          disabled={member.id === team.leader_id}
        >
          <UserXIcon />
          Исключить из команды
        </DropdownMenuItem>
      }
      {...props}
    />
  );
}
