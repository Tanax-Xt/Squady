"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { UserRegistrationConflictResponse } from "@/shared/api";

import { RegisterFormSchema } from "./schema";
import { RegisterFormFieldValues } from "./types";
import { register } from "../api/actions";

const CONFLIT_MESSAGES = {
  email: "Эта почта уже зарегистрирована.",
  username: "Это имя пользователя уже занято.",
} as const;

export const useRegisterForm = (
  defaultValues: RegisterFormFieldValues = {
    username: "",
    email: "",
    password1: "",
    password2: "",
  },
) => {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(RegisterFormSchema),
    defaultValues,
  });

  const username = form.watch("username");
  const email = form.watch("email");
  const password = form.watch("password1");

  const [response, dispatch, pending] = useActionState(
    register.bind(null, { username, email, password }),
    undefined,
  );

  const submit = form.handleSubmit(() => startTransition(dispatch));

  useEffect(() => {
    switch (response?.status) {
      case 409:
        const error = response.error as UserRegistrationConflictResponse;

        return form.setError(
          error.subject,
          {
            message: CONFLIT_MESSAGES[error.subject],
          },
          { shouldFocus: true },
        );
    }
  }, [response]);

  return [form, submit, pending] as const;
};
