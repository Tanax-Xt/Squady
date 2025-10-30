import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { ResumesMyPublicEmpty } from "@/entities/resume";
import { getCurrentUserResumes } from "@/entities/user";
import { TeamCreateForm } from "@/features/team/create";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";

async function TeamsNewPage() {
  const resumes = await getCurrentUserResumes();
  const publicResumes = resumes?.resumes.filter((resume) => resume.is_public);

  return (
    <Page>
      <Bar>
        <Bar.Start>
          <Button variant="ghost" asChild>
            <Link href="/teams">
              <ArrowLeftIcon />
              Назад
            </Link>
          </Button>
        </Bar.Start>
        <Bar.Center>Новая команда</Bar.Center>
      </Bar>

      <Page.Content size="3xl">
        {!!publicResumes?.length ? (
          <TeamCreateForm resumes={publicResumes} />
        ) : (
          <ResumesMyPublicEmpty />
        )}
      </Page.Content>
    </Page>
  );
}

export { TeamsNewPage };
