"use client";

import { startTransition, useActionState, useEffect, useState } from "react";

import {
  mapResumeParsedResponseToResumeFormValues,
  ResumeForm,
  ResumeFormValues,
} from "@/entities/resume";
import { createResume } from "@/features/resume/edit";
import { ResumeParsedResponse } from "@/shared/api";
import { toast } from "@/shared/ui/sonner";

import ResumeGithubUrlForm from "./ResumeGithubUrlForm";

const ResumeCreateGithubPage: React.FunctionComponent = () => {
  const [response, submit, loading] = useActionState<
    ReturnType<typeof createResume>,
    ResumeFormValues
  >((_, values) => createResume(values), { error: {}, status: 200 });
  const [defaultValues, setDefaultValues] =
    useState<ResumeParsedResponse | null>(null);

  useEffect(() => {
    switch (response?.status) {
      case 409:
        toast.error("Резюме с этой ролью уже существует!");
        return;
    }
  }, [response]);

  return defaultValues ? (
    <ResumeForm
      loading={loading}
      defaultValues={mapResumeParsedResponseToResumeFormValues(defaultValues)}
      onSubmit={(values) => startTransition(() => submit(values))}
    />
  ) : (
    <ResumeGithubUrlForm onSubmit={setDefaultValues} />
  );
};

export default ResumeCreateGithubPage;
