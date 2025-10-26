"use client";

import Button from "@/shared/ui/button";
import Form from "@/shared/ui/form";
import Input from "@/shared/ui/input";
import { toast } from "@/shared/ui/sonner";
import Spinner from "@/shared/ui/spinner";

import { useUserUpdateUsernameForm } from "../model/form";
import { UserUpdateUsernameFormFieldValues } from "../model/types";

interface UserUpdateUsernameFormProps extends React.ComponentProps<"form"> {
  defaultValues?: UserUpdateUsernameFormFieldValues;
  onSuccess?: VoidFunction;
}

const UserUpdateUsernameForm: React.FunctionComponent<
  UserUpdateUsernameFormProps
> = ({
  defaultValues = { username: "" },
  onSuccess,
  onSubmit,
  ...otherProps
}) => {
  const [form, submit, pending] = useUserUpdateUsernameForm({
    defaultValues,
    onSuccess: () => {
      onSuccess?.();
      toast.success("Имя пользователя было успешно обновлено!");
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
          name="username"
          label="Новое имя пользователя"
          description="Это имя пользователя должно быть уникальным."
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Введите новое имя пользователя…"
              autoComplete="username"
              spellCheck={false}
            />
          )}
        />
      </Form.Fieldset>

      <Form.Response />

      <Button
        type="submit"
        loading={pending}
        disabled={!form.formState.isValid || !form.formState.isDirty}
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

export default UserUpdateUsernameForm;
