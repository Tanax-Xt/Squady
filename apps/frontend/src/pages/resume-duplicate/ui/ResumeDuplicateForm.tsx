"use client";

import { startTransition, useActionState, useEffect, useState } from "react";

import {
  mapResumeResponseToResumeFormValues,
  ResumeForm,
  ResumeFormValues,
} from "@/entities/resume";
import { ResumeResponse } from "@/shared/api";
import { toast } from "@/shared/ui/sonner";

import { duplicateResume } from "../api/actions";

const ResumeDuplicateForm: React.FunctionComponent<{
  resume: ResumeResponse;
}> = ({ resume }) => {
  const [response, submit, loading] = useActionState<
    ReturnType<typeof duplicateResume>,
    ResumeFormValues
  >((_, values) => duplicateResume(values), {
    error: {},
    status: 200,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    switch (response?.status) {
      case 409:
        toast.error("Резюме с этой ролью уже существует!");
        return;
    }
  }, [response]);

  if (!mounted) {
    return null;
  }

  const defaultValues = mapResumeResponseToResumeFormValues(resume);

  return (
    <ResumeForm
      loading={loading}
      defaultValues={defaultValues}
      onSubmit={(values) =>
        startTransition(() => submit({ ...defaultValues, ...values }))
      }
    />
  );
};

export default ResumeDuplicateForm;
