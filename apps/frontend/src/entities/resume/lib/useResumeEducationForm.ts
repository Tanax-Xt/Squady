"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import {
  ResumeEducationEndYearSchema,
  ResumeEducationTitleSchema,
  ResumeEducationTypeSchema,
} from "../model/schema/education";

export const ResumeEducationFormSchema = z.object({
  type: ResumeEducationTypeSchema,
  title: ResumeEducationTitleSchema,
  endYear: ResumeEducationEndYearSchema,
});

export type ResumeEducationFormValues = z.infer<
  typeof ResumeEducationFormSchema
>;

export type UseResumeEducationFormProps = {
  onSubmit?: SubmitHandler<ResumeEducationFormValues>;
  defaultValues?: DefaultValues<ResumeEducationFormValues>;
};

export const useResumeEducationForm = ({
  onSubmit,
  defaultValues = {
    type: "" as unknown as ResumeEducationFormValues["type"],
    title: "",
    endYear: "" as unknown as ResumeEducationFormValues["endYear"],
  },
}: UseResumeEducationFormProps) => {
  const form = useForm<ResumeEducationFormValues>({
    mode: "onChange",
    resolver: zodResolver(ResumeEducationFormSchema),
    defaultValues,
  });

  const submit = form.handleSubmit((values) => {
    form.reset();
    onSubmit?.(values);
  });

  return [form, submit] as const;
};
