"use client";

import Link from "next/link";

import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/button";
import Card from "@/shared/ui/card";
import Form from "@/shared/ui/form";
import Input from "@/shared/ui/input";
import Spinner from "@/shared/ui/spinner";

import { useLoginForm } from "../model/form";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [form, submit, pending] = useLoginForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <Card.Header>
          <Card.Title>Вход</Card.Title>
          <Card.Description>
            Войдите, если у вас уже есть аккаунт.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Form {...form} onSubmit={submit}>
            <Form.Fieldset disabled={pending}>
              <Form.Field
                control={form.control}
                name="username"
                label="Имя пользователя или электронная почта"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Введите ваше имя пользователя или почту…"
                    autoComplete="username email"
                    inputMode="email"
                    spellCheck={false}
                  />
                )}
              />

              <Form.Field
                control={form.control}
                name="password"
                label="Пароль"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder="Введите ваш пароль…"
                    autoComplete="password"
                  />
                )}
              />
            </Form.Fieldset>

            <Form.Response />

            <div className="mt-6 flex flex-col gap-2">
              <Button
                type="submit"
                loading={pending}
                disabled={!form.formState.isDirty || !form.formState.isValid}
              >
                {pending ? (
                  <>
                    <Spinner />
                    <span>Выполняется вход…</span>
                  </>
                ) : (
                  <>Войти</>
                )}
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">К форме регистрации</Link>
              </Button>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}
