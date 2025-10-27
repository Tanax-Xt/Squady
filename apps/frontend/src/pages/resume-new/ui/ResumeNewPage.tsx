"use client";

import { startTransition, useActionState, useEffect } from "react";

import { ResumeForm, ResumeFormValues } from "@/entities/resume";
import { toast } from "@/shared/ui/sonner";

import { createResume } from "../api/actions";

const ResumeNewPage: React.FunctionComponent = () => {
  const [response, submit, loading] = useActionState<
    ReturnType<typeof createResume>,
    ResumeFormValues
  >((_, values) => createResume(values), { error: {}, status: 200 });

  useEffect(() => {
    switch (response?.status) {
      case 409:
        toast.error("Резюме с этой ролью уже существует!");
        return;
    }
  }, [response]);

  return (
    <ResumeForm
      persist
      loading={loading}
      onSubmit={(values) => startTransition(() => submit(values))}
    />
  );
};

export default ResumeNewPage;
