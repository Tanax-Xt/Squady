import {
  ArrowLeftIcon,
  Settings2Icon,
  UserPlusIcon,
  UserSearchIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

import { getTeam, TEAM_MEMBERS_MAX_COUNT } from "@/entities/team";
import { getCurrentUserVerifiedParticipantOrMentor } from "@/entities/user";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import { CardContent, CardHeader, CardRoot, CardTitle } from "@/shared/ui/card";
import { ItemGroup, ItemSeparator } from "@/shared/ui/item";
import Page from "@/shared/ui/page";
import { TeamMemberItem } from "@/widgets/team-item";

import { TeamLeaveButton } from "./TeamLeaveButton";

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

  const teamMembersActive = team.users.filter(
    (user) => user.status === "active",
  );

  const isCurrentUserInTeam = !!team.users?.find(
    (user) => user.id === currentUser.id,
  );

  return (
    <Page>
      <Bar>
        <Bar.Start>
          <Button asChild variant="ghost">
            <Link href="/teams">
              <ArrowLeftIcon /> Назад
            </Link>
          </Button>
        </Bar.Start>
        <Bar.Center showAfterScrolled>Команда</Bar.Center>
        {team.leader_id === currentUser.id && (
          <Bar.End>
            <Button asChild variant="ghost">
              <Link href={`/teams/${team.id}/manage`}>Управлять</Link>
            </Button>
          </Bar.End>
        )}
      </Bar>
      <Page.Content size="3xl" className="gap-6">
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
              <span className="text-muted-foreground">
                ({teamMembersActive.length}/{TEAM_MEMBERS_MAX_COUNT})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              {teamMembersActive.map((member, index) => (
                <Fragment key={member.id}>
                  <TeamMemberItem
                    team={team}
                    resume={member.resume}
                    member={member}
                    id={`member-${member.id}`}
                    className="scroll-mt-20 px-0"
                  />
                  {index !== teamMembersActive.length - 1 && <ItemSeparator />}
                </Fragment>
              ))}
            </ItemGroup>
          </CardContent>
        </CardRoot>

        {currentUser.id === team.leader_id ? (
          <section className="flex gap-3 max-sm:flex-col">
            {team.users.length < TEAM_MEMBERS_MAX_COUNT && (
              <Button size="lg" variant="outline" className="grow" asChild>
                <Link href={`/teams/${team.id}/recruitment`}>
                  <UserSearchIcon />
                  Подбор участников
                </Link>
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="grow !text-primary"
              asChild
            >
              <Link href={`/teams/${team.id}/manage`}>
                <Settings2Icon />
                Управление командой
              </Link>
            </Button>
          </section>
        ) : (
          <>
            {isCurrentUserInTeam
              ? currentUser.id !== team.leader_id && (
                  <TeamLeaveButton team={team} userId={currentUser.id} />
                )
              : team.users.length < TEAM_MEMBERS_MAX_COUNT && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="!text-success"
                    asChild
                  >
                    <Link href={`/teams/${team.id}/join`}>
                      <UserPlusIcon />
                      Вступить в команду
                    </Link>
                  </Button>
                )}
          </>
        )}
      </Page.Content>
    </Page>
  );
}
