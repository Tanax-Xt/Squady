"use server";

import { ArrowLeftIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getTeam, getTeamApplications } from "@/entities/team";
import { getCurrentUserVerifiedParticipantOrMentorWithPersonalData } from "@/entities/user";
import { TeamEditForm } from "@/features/team/edit";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";

import { TeamActiveMembersCard } from "./TeamActiveMembersCard";
import { TeamApplicationMetrics } from "./TeamApplicationMetrics";
import { TeamApplicationMetricsInvites } from "./TeamApplicationMetricsInvites";
import { TeamDeleteButton } from "./TeamDeleteButton";
import { TeamInCheckMembersCard } from "./TeamInCheckMembersCard";
import { TeamInvitationsCard } from "./TeamInvitationsCard";

export async function TeamManagePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ back: string }>;
}) {
  const { id } = await params;
  const { back = `/teams/${id}` } = await searchParams;

  const team = await getTeam(id);

  if (!team) {
    return notFound();
  }

  const currentUser =
    await getCurrentUserVerifiedParticipantOrMentorWithPersonalData();

  if (currentUser.id !== team.leader_id) {
    return notFound();
  }

  const applications = await getTeamApplications(id);

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const joinUrl = `${protocol}://${host}/teams/${team.id}/join`;

  return (
    <Page>
      <Bar>
        <Bar.Start>
          <Button variant="ghost" asChild>
            <Link href={back}>
              <ArrowLeftIcon /> Назад
            </Link>
          </Button>
        </Bar.Start>
        <Bar.Center>Управление командой</Bar.Center>
      </Bar>

      <Page.Content size="3xl" className="gap-8">
        <TeamEditForm team={team} />
        <TeamInvitationsCard joinUrl={joinUrl} teamId={team.id} />
        <TeamActiveMembersCard team={team} members={team.users} />
        <TeamInCheckMembersCard
          team={team}
          applications={applications}
          joinUrl={joinUrl}
        />
        <TeamApplicationMetrics team={team} />
        <TeamApplicationMetricsInvites team={team} />
        <TeamDeleteButton team={team} />
      </Page.Content>
    </Page>
  );
}
