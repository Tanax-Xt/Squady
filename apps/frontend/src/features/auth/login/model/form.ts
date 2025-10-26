import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { LoginFormSchema } from "./schema";
import { LoginFormFieldValues } from "./types";
import { login } from "../api/actions";

export const useLoginForm = (
  defaultValues: LoginFormFieldValues = { username: "", password: "" },
) => {
  const router = useRouter();

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(LoginFormSchema),
    defaultValues,
  });

  const username = form.watch("username");
  const password = form.watch("password");

  const [response, dispatch, pending] = useActionState(
    login.bind(null, { username, password, scope: "" }),
    undefined,
  );

  const submit = form.handleSubmit(() => startTransition(dispatch));

  useEffect(() => {
    switch (response?.status) {
      case 401:
        return form.setError("root", {
          message: "Введено неверное имя пользователя или пароль.",
        });
      case 403:
        router.push("/admin");
        break;
    }
  }, [response]);

  return [form, submit, pending] as const;
};
