"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { ResumeSkillSchema } from "../model/schema/skill";

export const ResumeSkillFormSchema = z.object({
  name: ResumeSkillSchema,
});

export type ResumeSkillFormValues = z.infer<typeof ResumeSkillFormSchema>;

export type UseResumeSkillFormProps = {
  onSubmit?: SubmitHandler<ResumeSkillFormValues>;
  defaultValues?: DefaultValues<ResumeSkillFormValues>;
};

export const useResumeSkillForm = ({
  onSubmit,
  defaultValues = { name: "" },
}: UseResumeSkillFormProps) => {
  const form = useForm<ResumeSkillFormValues>({
    mode: "onChange",
    resolver: zodResolver(ResumeSkillFormSchema),
    defaultValues,
  });

  const submit = form.handleSubmit((values) => {
    form.reset();
    onSubmit?.(values);
  });

  return [form, submit] as const;
};
