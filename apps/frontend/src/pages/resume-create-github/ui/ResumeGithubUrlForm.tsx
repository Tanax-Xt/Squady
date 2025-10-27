"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ResumeParseGithubUrlSchema } from "@/entities/resume";
import { ResumeParsedResponse } from "@/shared/api";
import Placeholder from "@/shared/ui/Placeholder";
import Button from "@/shared/ui/button";
import Form from "@/shared/ui/form";
import Input from "@/shared/ui/input";
import Spinner from "@/shared/ui/spinner";

import { parseGithubResume } from "../api/actions";

export const ResumeGithubUrlFormSchema = z.object({
  url: ResumeParseGithubUrlSchema,
});

export type ResumeGithubUrlFormValues = z.infer<
  typeof ResumeGithubUrlFormSchema
>;

export interface ResumeGithubUrlFormProps {
  onSubmit: (values: ResumeParsedResponse) => void;
}

const ResumeGithubUrlForm: React.FunctionComponent<
  ResumeGithubUrlFormProps
> = ({ onSubmit }) => {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(ResumeGithubUrlFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const values = form.watch();

  const [response, submit, loading] = useActionState(
    parseGithubResume.bind(null, values.url),
    undefined,
  );

  const handleSubmit = form.handleSubmit(() => {
    startTransition(() => {
      submit();
    });
  });

  useEffect(() => {
    if (response?.data) {
      onSubmit(response.data);
    }
  }, [response]);

  return (
    <div className="my-auto space-y-8">
      <Placeholder
        before={
          <Image
            src="/assets/github.png"
            alt="hh.ru"
            width={96}
            height={96}
            className="size-24 dark:invert"
          />
        }
        title="Импортировать из GitHub"
        description="Импортируйте данные о навыках и опыте из вашего GitHub-профиля."
      />
      <Form {...form} onSubmit={handleSubmit}>
        <Form.Fieldset>
          <Form.Field
            control={form.control}
            name="url"
            label="Ссылка"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="https://github.com/zobweyt"
                spellCheck={false}
              />
            )}
          />
        </Form.Fieldset>

        <Button
          type="submit"
          disabled={
            !form.formState.isDirty || !form.formState.isValid || loading
          }
          className="mt-4"
        >
          {loading && <Spinner />}
          {loading ? "Импорт..." : "Импортировать"}
        </Button>
      </Form>
    </div>
  );
};

export default ResumeGithubUrlForm;
