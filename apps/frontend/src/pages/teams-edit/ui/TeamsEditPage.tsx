import {
  ArrowLeftIcon,
  CheckIcon,
  CrownIcon,
  FileUserIcon,
  MoreVerticalIcon,
  UserXIcon,
  XIcon,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getTeam } from "@/entities/team";
import {
  getCurrentUserVerifiedParticipantOrMentorWithPersonalData,
  UserAvatar,
} from "@/entities/user";
import { TeamEditForm } from "@/features/team/edit";
import { UserResponse } from "@/shared/api";
import CopyButton from "@/shared/ui/CopyButton";
import Badge from "@/shared/ui/badge";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import { ButtonGroup } from "@/shared/ui/button-group";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/shared/ui/card";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/ui/input-group";
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

import { TeamDeleteButton } from "./TeamDeleteButton";
import { kickMemberFromTeam } from "../api/actions";

async function TeamsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const teamId = (await params).id;
  const team = await getTeam(teamId);
  const headersList = await headers();
  const host = headersList.get("host"); // e.g., 'www.example.com' or 'localhost:3000'

  // Construct the full URL, assuming HTTPS in production, HTTP in development
  const protocol =
    process.env.NODE_ENV === "production" ? "https://" : "http://";
  const fullHostNameWithProtocol = protocol + host;

  if (!team) {
    return notFound();
  }

  const currentUser =
    await getCurrentUserVerifiedParticipantOrMentorWithPersonalData();

  if (currentUser.id !== team.leader_id) {
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
            <Link href={`/teams/${team.id}`}>
              <ArrowLeftIcon /> Назад
            </Link>
          </Button>
        </Bar.Start>
        <Bar.Center>Редактирование</Bar.Center>
      </Bar>
      <Page.Content size="3xl">
        <TeamEditForm team={team} />

        <CardRoot>
          <CardHeader className="border-b">
            <CardTitle>Состав команды</CardTitle>
            <CardDescription>
              Приглашайте участников и управляйте составом команды.
            </CardDescription>
            <div className="mt-2 flex gap-2">
              <Input
                value={`${fullHostNameWithProtocol}/teams/${team.id}/join`}
                readOnly
              />
              <CopyButton
                value={`${fullHostNameWithProtocol}/teams/${team.id}/join`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="mb-2">
              Участники{" "}
              <span className="text-muted-foreground tabular-nums">
                ({team.users.length}/10)
              </span>
            </CardTitle>
            {team.users.map((user) => {
              const kick = kickMemberFromTeam.bind(null, teamId, user.id);
              return (
                <Item
                  id={`member-${user.id}`}
                  key={user.id}
                  size="sm"
                  className="scroll-mt-20"
                  variant="outline"
                >
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
                            href={`/resumes/${user.resume.id}?back=${encodeURIComponent(`/teams/${team.id}/edit#member-${user.id}`)}`}
                          >
                            <FileUserIcon />
                            Посмотреть резюме
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={kick}
                          disabled={user.id === team.leader_id}
                        >
                          <UserXIcon />
                          Исключить из команды
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenuRoot>
                  </ItemActions>
                </Item>
              );
            })}
          </CardContent>
          <CardFooter className="flex-col items-stretch border-t">
            <CardTitle className="mb-2">
              Заявки{" "}
              <span className="text-muted-foreground tabular-nums">(1)</span>
            </CardTitle>
            <Item size="sm" variant="outline" className="border-dashed">
              <ItemMedia variant="image">
                <UserAvatar
                  user={
                    {
                      username: "zobweyt",
                      role: "participant",
                    } as UserResponse
                  }
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="items-start max-md:flex-col-reverse">
                  Газиев Никита
                  <Badge
                    variant="outline"
                    className="!rounded-full !px-1.5 !py-0"
                  >
                    Фронтенд-разработчик
                  </Badge>
                </ItemTitle>
                <ItemDescription>user@example.com</ItemDescription>
              </ItemContent>
              <ItemActions>
                {/* TODO: ~~open in new tab~~. back anchor */}
                <Button size="sm" variant="outline" className="rounded-full">
                  <FileUserIcon />
                  Посмотреть резюме
                </Button>
                <ButtonGroup>
                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="rounded-s-full"
                      >
                        <CheckIcon className="text-success" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Принять</TooltipContent>
                  </TooltipRoot>
                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="rounded-e-full"
                      >
                        <XIcon className="text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Отклонить</TooltipContent>
                  </TooltipRoot>
                </ButtonGroup>
              </ItemActions>
            </Item>
            <Field className="mt-4 gap-0">
              <FieldLabel htmlFor="team-invite-form-email" className="mb-2">
                Пригласить по электронной почте
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type="email"
                  id="team-invite-form-email"
                  placeholder="user@example.com"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton type="submit">Отправить</InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </CardFooter>
        </CardRoot>
        <CardRoot>
          <CardHeader className="gap-0">
            <CardTitle>Действия с командой</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamDeleteButton teamId={teamId} />
          </CardContent>
        </CardRoot>
      </Page.Content>
    </Page>
  );
}

export { TeamsEditPage };
