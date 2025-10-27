import { z } from "zod";

import { env } from "@/shared/config/client";
import { MONTHS } from "@/shared/lib/month";
import { superRefineItemDateRange } from "@/shared/lib/month/range";

export const ResumeExperienceYearSchema = z.coerce
  .number({ message: "Год должен быть числом." })
  .int({ message: "Год должен быть целым числом." })
  .positive({ message: "Год должен быть позитивным числом." })
  .refine((year) => 1000 <= year && year <= 9999, {
    message: "Введите верный год.",
  })
  .refine((year) => year <= new Date().getFullYear(), {
    message: "Год не может быть в будущем.",
  });

export const ResumeExperienceSchema = z
  .object({
    title: z
      .string()
      .nonempty({ message: "Заполните это поле." })
      .max(env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_TITLE_MAX_LENGTH, {
        message: `Название должно содержать максимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_TITLE_MAX_LENGTH} символов.`,
      })
      .trim(),
    description: z.string().nonempty().trim(),
    startYear: ResumeExperienceYearSchema,
    startMonth: z.enum(MONTHS, { message: "Выберите месяц." }),
    endYear: ResumeExperienceYearSchema.nullable(),
    endMonth: z.enum(MONTHS, { message: "Выберите месяц." }).nullable(),
    company: z.string().trim(),
  })
  .superRefine(superRefineItemDateRange);

export type ResumeExperience = z.infer<typeof ResumeExperienceSchema>;
