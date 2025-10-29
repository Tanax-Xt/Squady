import { notFound } from "next/navigation";

import { getResume } from "@/entities/resume";
import Bar from "@/shared/ui/bar";
import Page from "@/shared/ui/page";

import ResumeDuplicateForm from "./ResumeDuplicateForm";
import { ResumeDuplicatePageBack } from "./ResumeDuplicatePageBack";

const ResumeDuplicatePage: React.FunctionComponent<{
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
        <ResumeDuplicatePageBack href={back ?? `/resumes/${resume.id}`} />

        <Bar.Center>Дублирование</Bar.Center>
      </Bar>

      <Page.Content size="xl">
        <ResumeDuplicateForm resume={resume} />
      </Page.Content>
    </Page>
  );
};

export default ResumeDuplicatePage;
