"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";

import { UserUpdateRoleSchema } from "./schema";
import { UserUpdateRoleFormFieldValues } from "./types";
import { updateCurrentUserRole } from "../api/actions";

interface UseUserUpdateRoleFormProps {
  defaultValues?: UserUpdateRoleFormFieldValues;
}

export const useUserUpdateRoleForm = ({
  defaultValues,
}: UseUserUpdateRoleFormProps) => {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(UserUpdateRoleSchema),
    defaultValues,
  });

  const role = form.watch("role");

  const [_, dispath, pending] = useActionState(
    updateCurrentUserRole.bind(null, { role }),
    undefined,
  );

  const submit = form.handleSubmit(() => startTransition(dispath));

  return [form, submit, pending] as const;
};
