import {
  ArrowLeftIcon,
  ChevronRightIcon,
  CrownIcon,
  FileUserIcon,
  MoreVerticalIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getTeam, TEAM_MEMBERS_MAX_COUNT } from "@/entities/team";
import {
  getCurrentUserVerifiedParticipantOrMentor,
  UserAvatar,
} from "@/entities/user";
import { AvatarFallback, AvatarRoot } from "@/shared/ui/avatar";
import Badge from "@/shared/ui/badge";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import { CardContent, CardHeader, CardRoot, CardTitle } from "@/shared/ui/card";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
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
import Page from "@/shared/ui/page";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

export async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const teamId = (await params).id;
  const team = await getTeam(teamId);
  const currentUser = await getCurrentUserVerifiedParticipantOrMentor();

  if (!team) {
    return notFound();
  }

  return (
    <Page>
      <Bar>
        <Bar.Start>
          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground max-md:text-base max-md:[&_svg:not([class*='size-'])]:size-5"
          >
            <Link href="/teams">
              <ArrowLeftIcon /> Назад
            </Link>
          </Button>
        </Bar.Start>
        <Bar.Center showAfterScrolled>Команда</Bar.Center>
        <Bar.End>
          {team.leader_id === currentUser.id && (
            <Button
              asChild
              variant="ghost"
              className="text-muted-foreground max-md:text-base max-md:[&_svg:not([class*='size-'])]:size-5"
            >
              <Link href={`/teams/${team.id}/edit`}>Изменить</Link>
            </Button>
          )}
        </Bar.End>
      </Bar>
      <Page.Content size="3xl">
        <h1 className="text-2xl font-semibold">{team.title}</h1>

        {team.about && (
          <CardRoot>
            <CardHeader className="gap-0">
              <CardTitle>О команде</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{team.about}</p>
            </CardContent>
          </CardRoot>
        )}

        {team.tasks && (
          <CardRoot>
            <CardHeader className="gap-0">
              <CardTitle>Задачи</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{team.tasks}</p>
            </CardContent>
          </CardRoot>
        )}

        <CardRoot>
          <CardHeader className="gap-0">
            <CardTitle>
              Участники{" "}
              <span className="text-muted-foreground tabular-nums">
                ({team.users.length}/{TEAM_MEMBERS_MAX_COUNT})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {team.users.map((user) => (
              <Item key={user.id} size="sm" variant="outline">
                <ItemMedia variant="image">
                  <UserAvatar user={user} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="items-start max-md:flex-col-reverse">
                    <span>
                      {user.full_name?.split(" ").slice(0, 2).join(" ") ??
                        user.username}
                      <TooltipRoot>
                        <TooltipTrigger className="ms-1">
                          {user.id === team.leader_id && (
                            <CrownIcon className="-mb-0.5 size-4 text-yellow-600 dark:text-yellow-500" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>Лидер команды</TooltipContent>
                      </TooltipRoot>
                    </span>
                    <Badge
                      variant="outline"
                      className="!rounded-full !px-1.5 !py-0"
                    >
                      {user.resume.role}
                    </Badge>
                  </ItemTitle>

                  <ItemDescription>{user.email}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <DropdownMenuRoot>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="rounded-full"
                      >
                        <MoreVerticalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/resumes/${user.resume.id}?back=${encodeURIComponent(`/teams/${team.id}`)}`}
                        >
                          <FileUserIcon />
                          Посмотреть резюме
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenuRoot>
                </ItemActions>
              </Item>
            ))}
            {team.users.length < TEAM_MEMBERS_MAX_COUNT && (
              <Item size="sm" className={"border-dashed border-border"} asChild>
                <Link href={`/teams/${team.id}/join`}>
                  <ItemMedia variant="image">
                    <AvatarRoot>
                      <AvatarFallback>
                        <PlusIcon className="size-5" />
                      </AvatarFallback>
                    </AvatarRoot>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="items-start max-md:flex-col-reverse">
                      Стать участником
                    </ItemTitle>
                    <ItemDescription>
                      Подать заявку на вступление в эту команду
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon className="size-4" />
                  </ItemActions>
                </Link>
              </Item>
            )}
          </CardContent>
        </CardRoot>
      </Page.Content>
    </Page>
  );
}
