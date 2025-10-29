"use client";

import { ChevronRightIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

import {
  getTeamStatusDisplayName,
  TEAM_MEMBERS_MAX_COUNT,
} from "@/entities/team";
import { UserAvatar } from "@/entities/user";
import { TeamResponse } from "@/shared/api";
import { AvatarFallback, AvatarRoot } from "@/shared/ui/avatar";
import Badge from "@/shared/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/shared/ui/item";

function TeamItem({ team }: { team: TeamResponse }) {
  const activeUsers = team.users.filter((user) => user.status === "active");

  return (
    <Item
      variant="muted"
      className="border-border max-lg:flex-col max-lg:items-start"
      asChild
    >
      <Link href={`/teams/${team.id}`}>
        <ItemContent>
          <ItemTitle>
            {team.title}
            <Badge
              variant={team.status === "active" ? "default" : "outline"}
              className="!rounded-full !px-1.5 !py-0"
            >
              {getTeamStatusDisplayName(team.status)}
            </Badge>
          </ItemTitle>
          {team.about && <ItemDescription>{team.about}</ItemDescription>}
        </ItemContent>
        <ItemActions>
          <div className="flex -space-x-2">
            {activeUsers.map((user) => (
              <UserAvatar key={user.id} user={user} />
            ))}
            {Array.from({
              length: TEAM_MEMBERS_MAX_COUNT - activeUsers.length,
            }).map((_, index) => (
              <AvatarRoot key={index}>
                <AvatarFallback>
                  <PlusIcon className="size-5" />
                </AvatarFallback>
              </AvatarRoot>
            ))}
          </div>
          <span className="text-muted-foreground tabular-nums">
            {activeUsers.length}/{TEAM_MEMBERS_MAX_COUNT}
          </span>
          <ChevronRightIcon className="size-4 max-md:hidden" />
        </ItemActions>
      </Link>
    </Item>
  );
}

export { TeamItem };
