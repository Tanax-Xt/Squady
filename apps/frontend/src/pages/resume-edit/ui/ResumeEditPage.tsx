import { notFound } from "next/navigation";

import { getResume } from "@/entities/resume";
import Bar from "@/shared/ui/bar";
import Page from "@/shared/ui/page";

import ResumeEditForm from "./ResumeEditForm";
import { ResumeEditPageBack } from "./ResumeEditPageBack";

const ResumeEditPage: React.FunctionComponent<{
  params: Promise<{ id?: string | undefined }>;
  searchParams: Promise<{ back?: string | undefined }>;
}> = async ({ params, searchParams }) => {
  const resumeId = (await params).id;
  const back = (await searchParams).back;

  if (!resumeId) {
    return notFound();
  }

  const resume = await getResume(resumeId);

  if (!resume) {
    return notFound();
  }

  return (
    <Page>
      <Bar>
        <ResumeEditPageBack href={back ?? `/resume/${resume.id}`} />

        <Bar.Center>Редактирование резюме</Bar.Center>
      </Bar>

      <Page.Content size="xl">
        <ResumeEditForm resume={resume} />
      </Page.Content>
    </Page>
  );
};

export default ResumeEditPage;
