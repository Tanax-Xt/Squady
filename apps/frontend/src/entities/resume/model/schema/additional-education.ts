import { z } from "zod";

import { env } from "@/shared/config/client";
import { MONTHS } from "@/shared/lib/month";
import { superRefineItemDateRange } from "@/shared/lib/month/range";

export const ResumeAdditionalEducationYearSchema = z.coerce
  .number({ message: "Год должен быть числом." })
  .int({ message: "Год должен быть целым числом." })
  .positive({ message: "Год должен быть позитивным числом." })
  .refine((year) => 1000 <= year && year <= 9999, {
    message: "Введите верный год.",
  });

export const ResumeAdditionalEducationSchema = z
  .object({
    title: z
      .string()
      .nonempty({ message: "Заполните это поле." })
      .max(env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_TITLE_MAX_LENGTH, {
        message: `Название должно содержать максимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_TITLE_MAX_LENGTH} символов.`,
      })
      .trim(),
    startYear: ResumeAdditionalEducationYearSchema,
    startMonth: z.enum(MONTHS, { message: "Выберите месяц." }),
    endYear: ResumeAdditionalEducationYearSchema.nullable(),
    endMonth: z.enum(MONTHS, { message: "Выберите месяц." }).nullable(),
  })
  .superRefine(superRefineItemDateRange);

export type ResumeAdditionalEducation = z.infer<
  typeof ResumeAdditionalEducationSchema
>;
