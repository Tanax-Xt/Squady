import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getResumesSkills } from "@/entities/resume";
import { getTeam } from "@/entities/team";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";

import { TeamRecruitmentPageContent } from "./TeamRecruitmentPageContent";

export async function TeamRecruitmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const team = await getTeam(id);

  if (!team) {
    return notFound();
  }

  const skills = await getResumesSkills();

  return (
    <Page>
      <Bar>
        <Bar.Start>
          <Button asChild variant="ghost">
            <Link href={`/teams/${team.id}`}>
              <ArrowLeftIcon /> Назад
            </Link>
          </Button>
        </Bar.Start>
        <Bar.Center>Подбор участников</Bar.Center>
      </Bar>

      <TeamRecruitmentPageContent skills={skills} team={team} />
    </Page>
  );
}
