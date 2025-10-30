import { Fragment } from "react";

import { TEAM_MEMBERS_MAX_COUNT } from "@/entities/team";
import { MemberResponse, TeamResponse } from "@/shared/api";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/shared/ui/card";
import { ItemGroup, ItemSeparator } from "@/shared/ui/item";
import { TeamActiveMemberItem } from "@/widgets/team-item";

export function TeamActiveMembersCard({
  team,
  members,
}: {
  team: TeamResponse;
  members: MemberResponse[];
}) {
  return (
    <CardRoot>
      <CardHeader>
        <CardTitle>
          Участники{" "}
          <span className="text-muted-foreground">
            ({members.length}/{TEAM_MEMBERS_MAX_COUNT})
          </span>
        </CardTitle>
        <CardDescription>Управляйте составом вашей команды.</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {members.map((member, index) => (
            <Fragment key={member.id}>
              <TeamActiveMemberItem
                team={team}
                member={member}
                resume={member.resume}
                back={`/teams/${team.id}/manage#member-${member.id}`}
                id={`member-${member.id}`}
                className="scroll-mt-20 px-0"
              />
              {index !== members.length - 1 && <ItemSeparator />}
            </Fragment>
          ))}
        </ItemGroup>
      </CardContent>
    </CardRoot>
  );
}
