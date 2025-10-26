"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { DefaultValues, useForm } from "react-hook-form";

import { ResumeProfileEditFormSchema } from "./schema";
import { ResumeProfileEditFormValues } from "./types";
import {
  setCurrentUserPersonalData,
  updateCurrentUserPersonalData,
} from "../api/actions";

export type UseResumeProfileEditFormProps = {
  defaultValues?: DefaultValues<ResumeProfileEditFormValues>;
};

export const useResumeProfileEditForm = ({
  defaultValues = {
    full_name: "",
    birth_date: "",
    city: "",
    telegram: "",
    about: "",
  },
  ...otherProps
}: UseResumeProfileEditFormProps) => {
  const form = useForm<ResumeProfileEditFormValues>({
    mode: "onChange",
    resolver: zodResolver(ResumeProfileEditFormSchema),
    defaultValues,
    ...otherProps,
  });

  const [, dispatch, pending] = useActionState(async () => {
    return !!defaultValues?.full_name
      ? updateCurrentUserPersonalData(form.getValues())
      : setCurrentUserPersonalData(form.getValues());
  }, undefined);

  const submit = form.handleSubmit(() => startTransition(dispatch));

  return [form, submit, pending] as const;
};
