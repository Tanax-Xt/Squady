"use client";

import Link from "next/link";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import Card from "@/shared/ui/card";
import Form from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import Spinner from "@/shared/ui/spinner";

import { useRegisterForm } from "../model/form";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [form, submit, pending] = useRegisterForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <Card.Header>
          <Card.Title>Регистрация</Card.Title>
          <Card.Description>
            Создайте новый аккаунт, если у вас его ещё нет.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Form {...form} onSubmit={submit}>
            <Form.Fieldset disabled={pending}>
              <Form.Field
                control={form.control}
                name="username"
                label="Имя пользователя"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Введите имя пользователя…"
                    autoComplete="username"
                    spellCheck={false}
                  />
                )}
              />

              <Form.Field
                control={form.control}
                name="email"
                label="Электронная почта"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Введите электронную почту…"
                    autoComplete="email"
                    spellCheck={false}
                  />
                )}
              />

              <Form.Field
                control={form.control}
                name="password1"
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
                name="password2"
                label="Подтверждение нового пароля"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder="Введите новый пароль ещё раз…"
                    autoComplete="new-password"
                  />
                )}
              />
            </Form.Fieldset>

            <Form.Response />

            <div className="mt-6 flex flex-col gap-2">
              <Button
                type="submit"
                disabled={
                  !form.formState.isDirty || !form.formState.isValid || pending
                }
              >
                {pending ? (
                  <>
                    <Spinner />
                    <span>Выполняется регистрация…</span>
                  </>
                ) : (
                  <>Зарегистрироваться</>
                )}
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">К форме входа</Link>
              </Button>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}
