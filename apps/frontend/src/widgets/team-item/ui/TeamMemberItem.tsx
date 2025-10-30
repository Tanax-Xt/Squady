import { ChevronRightIcon, CrownIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";

import { getTeamMemberDisplayName } from "@/entities/team";
import { UserAvatar } from "@/entities/user";
import {
  ResumeResponse,
  TeamResponse,
  UserPersonalDataResponse,
} from "@/shared/api";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

export function TeamMemberItem({
  team,
  member,
  resume,
  back = `/teams/${team.id}#member-${member.id}`,
  actions,
  dropdownItems,
  ...props
}: React.ComponentProps<typeof Item> & {
  team: TeamResponse;
  member: UserPersonalDataResponse;
  resume: ResumeResponse;
  back?: string;
  actions?: React.ReactNode;
  dropdownItems?: React.ReactNode;
}) {
  return (
    <Item size="sm" {...props}>
      <ItemMedia className="mt-1">
        <UserAvatar user={member} />
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle>
          <span className="inline-block max-w-full truncate">
            {getTeamMemberDisplayName(member)}
          </span>
          {member.id === team.leader_id && (
            <TooltipRoot>
              <TooltipTrigger>
                <CrownIcon className="size-4 flex-shrink-0 text-yellow-600" />
              </TooltipTrigger>
              <TooltipContent>Лидер команды</TooltipContent>
            </TooltipRoot>
          )}
        </ItemTitle>

        <ItemDescription className="max-w-full truncate">
          {member.email}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <span className="me-2 truncate text-muted-foreground max-lg:sr-only">
          {resume.role}
        </span>

        {actions}

        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="outline" className="rounded-full">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="p-0" asChild>
              <Link
                href={`/resumes/${resume.id}?back=${encodeURIComponent(back)}`}
              >
                <Item className="p-2">
                  <ItemMedia className="mt-1">
                    <UserAvatar user={member} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Посмотреть резюме</ItemTitle>
                    <ItemDescription>{resume.role}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon />
                  </ItemActions>
                </Item>
              </Link>
            </DropdownMenuItem>
            {dropdownItems && (
              <>
                <DropdownMenuSeparator />
                {dropdownItems}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </ItemActions>
    </Item>
  );
}
