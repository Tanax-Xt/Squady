"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileTextIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ResumeParsedResponse } from "@/shared/api";
import { env } from "@/shared/config/client";
import Placeholder from "@/shared/ui/Placeholder";
import { Button } from "@/shared/ui/button";
import Form from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { toast } from "@/shared/ui/sonner";
import Spinner from "@/shared/ui/spinner";

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
  const [loading, start] = useTransition();
  const [response, setResponse] = useState<null | ResumeParsedResponse>(null);
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(ResumePdfFormSchema),
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    start(async () => {
      const formData = new FormData();
      formData.set("file", values.file);
      const respose = await fetch("/bff/parse-resume-pdf", {
        body: formData,
        method: "POST",
      });
      const json = (await respose.json()) as unknown as {
        data: ResumeParsedResponse;
        error: unknown;
        status: number;
      };
      if (json.status === 400) {
        toast.error(
          "Не удалось импортировать резюме из PDF-файла. Попробуйте другой файл.",
        );
      } else if (!json.data || json.error) {
        toast.error("Ошибка сервера при парсинге резюме.");
      } else {
        setResponse(json.data);
      }
    });
  });

  useEffect(() => {
    if (response) {
      onSubmit(response);
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
          disabled={!form.formState.isValid || loading}
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
