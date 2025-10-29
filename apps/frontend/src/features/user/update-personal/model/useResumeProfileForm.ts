"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm, UseFormProps } from "react-hook-form";

import { putCurrentUserPersonalData } from "../api/actions";
import {
  resumeProfileFormSchema,
  ResumeProfileFormValues,
} from "../model/resumeProfileFormSchema";

export const useResumeProfileForm = (
  props: UseFormProps<ResumeProfileFormValues>,
) => {
  const form = useForm<ResumeProfileFormValues>({
    mode: "onChange",
    resolver: zodResolver(resumeProfileFormSchema),
    ...props,
  });

  const [loading, startLoading] = useTransition();

  const submit = form.handleSubmit((values) => {
    startLoading(async () => {
      await putCurrentUserPersonalData(values);
    });
  });

  return [form, submit, loading] as const;
};
