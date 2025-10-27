"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileTextIcon } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ResumeParsedResponse } from "@/shared/api";
import { env } from "@/shared/config/client";
import Placeholder from "@/shared/ui/Placeholder";
import Button from "@/shared/ui/button";
import Form from "@/shared/ui/form";
import Input from "@/shared/ui/input";
import Spinner from "@/shared/ui/spinner";

import { parsePdfResume } from "../api/actions";

const ACCEPTED_PDF_TYPES = ["application/pdf"];
const PdfFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= env.NEXT_PUBLIC_SQUADY_API_RESUME_MAX_PDF_SIZE,
    `Максимальный размер файла ${env.NEXT_PUBLIC_SQUADY_API_RESUME_MAX_PDF_SIZE} байт.`,
  )
  .refine(
    (file) => ACCEPTED_PDF_TYPES.includes(file.type),
    "Поддерживается только PDF.",
  );

export const ResumePdfFormSchema = z.object({
  file: PdfFileSchema,
});

export type ResumePdfFormValues = z.infer<typeof ResumePdfFormSchema>;

export interface ResumePdfFormProps {
  onSubmit: (values: ResumeParsedResponse) => void;
}

const ResumePdfForm: React.FunctionComponent<ResumePdfFormProps> = ({
  onSubmit,
}) => {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(ResumePdfFormSchema),
  });

  const [response, submitAction, loading] = useActionState<
    ReturnType<typeof parsePdfResume>,
    ResumePdfFormValues
  >(
    async (_, { file }) => {
      return await parsePdfResume(file);
    },
    { data: null, error: {}, status: 0 },
  );

  const handleSubmit = form.handleSubmit(async (values) => {
    startTransition(() => {
      submitAction(values);
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
        before={<FileTextIcon />}
        title="Импортировать из PDF"
        description="Загрузите PDF-файл, и наш ИИ автоматически извлечёт данные и оформит резюме в нужном формате."
      />
      <Form {...form} onSubmit={handleSubmit}>
        <Form.Fieldset>
          <Form.Field
            control={form.control}
            name="file"
            label="PDF-Файл"
            render={({ field: { onChange, value: _, ...rest } }) => (
              <Input
                {...rest}
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const { files } = e.target;
                  if (files && files[0]) {
                    onChange(files[0]);
                  }
                }}
                placeholder="Выберите файл"
              />
            )}
          />
        </Form.Fieldset>

        <Button
          type="submit"
          disabled={!form.formState.isDirty || loading}
          className="mt-4"
        >
          {loading && <Spinner />}
          {loading ? "Импорт..." : "Импортировать"}
        </Button>
      </Form>
    </div>
  );
};

export default ResumePdfForm;
