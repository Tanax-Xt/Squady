"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ResumeParseHeadHunterUrlSchema } from "@/entities/resume";
import { ResumeParsedResponse } from "@/shared/api";
import Placeholder from "@/shared/ui/Placeholder";
import Button from "@/shared/ui/button";
import Form from "@/shared/ui/form";
import Input from "@/shared/ui/input";
import Spinner from "@/shared/ui/spinner";

import { parseHeadHunterResume } from "../api/actions";

export const ResumeHeadHunterUrlFormSchema = z.object({
  url: ResumeParseHeadHunterUrlSchema,
});

export type ResumeHeadHunterUrlFormValues = z.infer<
  typeof ResumeHeadHunterUrlFormSchema
>;

export interface ResumeHeadHunterUrlFormProps {
  onSubmit: (values: ResumeParsedResponse) => void;
}

const ResumeHeadHunterUrlForm: React.FunctionComponent<
  ResumeHeadHunterUrlFormProps
> = ({ onSubmit }) => {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(ResumeHeadHunterUrlFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const values = form.watch();

  const [response, submit, loading] = useActionState(
    parseHeadHunterResume.bind(null, values.url),
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
            src="/assets/hh.svg"
            alt="hh.ru"
            width={96}
            height={96}
            className="size-24"
          />
        }
        title="Импортировать из HeadHunter"
        description="Перенесите информацию о резюме с HeadHunter одной ссылкой."
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
                placeholder="https://hh.ru/resume/c65994feff0d2817f70039ed1f796a4c364138"
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

export default ResumeHeadHunterUrlForm;
