"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { sendTeamInvite } from "@/features/team/manage";
import Collapse from "@/shared/ui/Collapse";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/ui/input-group";
import Spinner from "@/shared/ui/spinner";

export function TeamInviteField({ teamId }: { teamId: string }) {
  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(
      z.object({
        email: z
          .string()
          .nonempty({ message: "Введите адрес электронной почты." })
          .email({ message: "Введите корректный адрес электронной почты." }),
      }),
    ),
    defaultValues: {
      email: "",
    },
  });

  const [sending, startSending] = useTransition();

  const submit = form.handleSubmit((values) => {
    startSending(async () => {
      const { status } = await sendTeamInvite(teamId, values);

      if (status === 204) {
        toast.success(`Приглашение отправлено на почту ${values.email}!`);
      } else {
        toast.error("Не удалось отправить приглашение! Попробуйте ещё раз.");
      }

      form.reset();
    });
  });

  return (
    <form onSubmit={submit}>
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-0">
            <FieldLabel htmlFor="team-invite-form-email" className="mb-3">
              Пригласить по электронной почте
            </FieldLabel>
            <InputGroup className="mb-3">
              <InputGroupInput
                {...field}
                type="email"
                id="team-invite-form-email"
                placeholder="user@example.com"
                aria-invalid={fieldState.invalid}
                disabled={sending}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="submit"
                  disabled={!form.formState.isValid || sending}
                >
                  {sending && <Spinner />}
                  {sending ? "Приглашение..." : "Пригласить"}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>
              Пользователю отправится электронное письмо с ссылкой для подачи
              заявки.
            </FieldDescription>

            <Collapse>
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} className="mt-3" />
              )}
            </Collapse>
          </Field>
        )}
      />
    </form>
  );
}
