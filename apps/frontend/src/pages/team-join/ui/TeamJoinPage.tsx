import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ResumesMyPublicEmpty } from "@/entities/resume";
import { getTeam } from "@/entities/team";
import {
  getCurrentUserResumes,
  getCurrentUserVerifiedParticipantOrMentorWithPersonalData,
} from "@/entities/user";
import { TeamJoinForm } from "@/features/team/join";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";

export async function TeamJoinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const teamId = (await params).id;
  const team = await getTeam(teamId);

  if (!team) {
    return notFound();
  }
  const currentUser =
    await getCurrentUserVerifiedParticipantOrMentorWithPersonalData();

  if (!currentUser) {
    return notFound();
  }
  if (currentUser.id === team.leader_id) {
    return notFound();
  }

  const resumes = await getCurrentUserResumes();
  const publicResumes = resumes?.resumes.filter((resume) => resume.is_public);

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
        <Bar.Center>Присоединиться</Bar.Center>
      </Bar>
      <Page.Content size="3xl">
        {!!publicResumes?.length ? (
          <TeamJoinForm
            resumes={publicResumes}
            user={currentUser}
            team={team}
          />
        ) : (
          <ResumesMyPublicEmpty />
        )}
      </Page.Content>
    </Page>
  );
}
