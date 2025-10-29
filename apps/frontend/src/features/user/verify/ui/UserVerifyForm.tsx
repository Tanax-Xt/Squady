"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { InboxIcon } from "lucide-react";
import { startTransition } from "react";

import { CurrentUserResponse } from "@/shared/api";
import { env } from "@/shared/config/client";
import { cn } from "@/shared/lib/utils";
import Placeholder from "@/shared/ui/Placeholder";
import { Button } from "@/shared/ui/button";
import Form from "@/shared/ui/form";
import InputOTP from "@/shared/ui/input-otp";
import Spinner from "@/shared/ui/spinner";

import { useUserVerifyForm } from "../model/form";
import { UserVerifyFormFieldValues } from "../model/types";

interface UserUpdatePasswordFormProps
  extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  defaultValues?: UserVerifyFormFieldValues;
  user: CurrentUserResponse;
}

const UserUpdatePasswordForm: React.FunctionComponent<
  UserUpdatePasswordFormProps
> = ({ defaultValues, user, className, ...otherProps }) => {
  const { otp, form, submit, pending, resend, sending, remaining, accepted } =
    useUserVerifyForm({ defaultValues });

  return (
    <Form
      {...form}
      onSubmit={submit}
      className={cn("flex w-full grow flex-col justify-center", className)}
      {...otherProps}
    >
      <Placeholder
        before={<InboxIcon />}
        title="Верификация"
        description={
          <>
            <span className="block">
              {sending || !otp
                ? "Высылаем письмо с 6-значным кодом подтверждения на ваш почтовый ящик:"
                : "Выслали письмо с 6-значным кодом подтверждения на ваш почтовый ящик:"}
            </span>
            <a
              href={`mailto:${user.email}`}
              className="hover text-accent-foreground transition-opacity hover:opacity-75 focus-visible:opacity-75 active:opacity-50"
            >
              {user.email}
            </a>
          </>
        }
        classNames={{ root: "grow-0 mb-4", description: "text-balance" }}
      />

      <Form.Fieldset disabled={pending}>
        <Form.Field
          control={form.control}
          name="otp"
          render={({ field }) => (
            <InputOTP
              {...field}
              pattern={REGEXP_ONLY_DIGITS}
              readOnly={accepted !== null}
              disabled={sending || !otp || pending}
              maxLength={env.NEXT_PUBLIC_SQUADY_OTP_LENGTH}
              onComplete={submit}
              containerClassName="justify-center"
            >
              {Array.from({ length: env.NEXT_PUBLIC_SQUADY_OTP_LENGTH }).map(
                (_, index) => (
                  <InputOTP.Slot key={index} index={index} valid={accepted} />
                ),
              )}
            </InputOTP>
          )}
          classNames={{
            error: "text-center",
          }}
        />
      </Form.Fieldset>

      <Form.Response />

      <Button
        type="button"
        variant="ghost"
        disabled={sending || accepted !== null || remaining !== 0 || pending}
        onClick={() => startTransition(() => resend())}
        className="mt-2 self-center md:w-fit"
      >
        {sending || !otp ? (
          <span className="flex items-center justify-center gap-1">
            <Spinner />
            <span>Отправка кода…</span>
          </span>
        ) : pending ? (
          <span className="flex items-center justify-center gap-1">
            <Spinner />
            <span>Проверка кода…</span>
          </span>
        ) : (
          <>Прислать ещё раз {remaining !== 0 && `(${remaining})`}</>
        )}
      </Button>
    </Form>
  );
};

export default UserUpdatePasswordForm;
