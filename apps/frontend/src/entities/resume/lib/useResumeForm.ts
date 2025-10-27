"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";

import { useLocalStorage } from "@/shared/hooks/use-local-storage";

import { ResumeFormSchema, ResumeFormValues } from "../model/schema/form";

export type UseResumeFormProps = {
  persist?: boolean;
  defaultValues?: DefaultValues<ResumeFormValues>;
  onSubmit?: SubmitHandler<ResumeFormValues>;
};

export const useResumeForm = ({
  persist,
  defaultValues = {
    role: "",
    isPublic: true,
  },
  onSubmit,
  ...otherProps
}: UseResumeFormProps) => {
  const [persistedValues, setPersistedValues, removePersistedValues] =
    useLocalStorage({
      key: "squady-resume-new-form-values",
      initialState: defaultValues,
    });

  const form = useForm<ResumeFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(ResumeFormSchema),
    defaultValues,
    ...otherProps,
  });

  const values = form.watch();

  const submit = form.handleSubmit((values) => {
    removePersistedValues();
    onSubmit?.(values);
  });

  useEffect(() => {
    if (
      !persist ||
      JSON.stringify(values) === JSON.stringify(persistedValues)
    ) {
      return;
    }

    setPersistedValues(values);
  }, [values]);

  useEffect(() => {
    if (!persist) {
      return;
    }

    form.reset(persistedValues);
  }, []);

  return [form, submit] as const;
};
