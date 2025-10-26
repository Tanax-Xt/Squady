"use client";

import { toast } from "sonner";

import Button from "@/shared/ui/button";
import Form from "@/shared/ui/form";
import Input from "@/shared/ui/input";
import Spinner from "@/shared/ui/spinner";

import { useUserUpdatePasswordForm } from "../model/form";
import { UserUpdatePasswordFormFieldValues } from "../model/types";

interface UserUpdatePasswordFormProps extends React.ComponentProps<"form"> {
  defaultValues?: UserUpdatePasswordFormFieldValues;
  onSuccess?: VoidFunction;
}

const UserUpdatePasswordForm: React.FunctionComponent<
  UserUpdatePasswordFormProps
> = ({ defaultValues, onSuccess, onSubmit, ...otherProps }) => {
  const [form, submit, pending] = useUserUpdatePasswordForm({
    defaultValues,
    onSuccess: () => {
      onSuccess?.();
      toast.success("Пароль был успешно обновлён!");
    },
  });

  return (
    <Form
      {...form}
      onSubmit={(event) => {
        submit(event);
        onSubmit?.(event);
      }}
      {...otherProps}
    >
      <Form.Fieldset disabled={pending}>
        <Form.Field
          control={form.control}
          name="oldPassword"
          label="Старый пароль"
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              placeholder="Введите ваш старый пароль…"
              autoComplete="password"
            />
          )}
        />

        <Form.Field
          control={form.control}
          name="newPassword1"
          label="Новый пароль"
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              placeholder="Введите новый пароль…"
              autoComplete="new-password"
            />
          )}
        />

        <Form.Field
          control={form.control}
          name="newPassword2"
          label="Подтверждение нового пароля"
          render={({ field }) => (
            <Input
              type="password"
              placeholder="Введите новый пароль ещё раз…"
              autoComplete="new-password"
              {...field}
            />
          )}
        />
      </Form.Fieldset>

      <Form.Response />

      <Button
        type="submit"
        loading={pending}
        disabled={!form.formState.isDirty || !form.formState.isValid}
        className="mt-6"
      >
        {pending ? (
          <>
            <Spinner />
            <span>Сохранение…</span>
          </>
        ) : (
          <>Сохранить</>
        )}
      </Button>
    </Form>
  );
};

export default UserUpdatePasswordForm;
