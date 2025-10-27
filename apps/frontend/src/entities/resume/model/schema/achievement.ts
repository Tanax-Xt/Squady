import { z } from "zod";

import { env } from "@/shared/config/client";

export const ResumeAchievementTitleSchema = z
  .string()
  .nonempty("Название достижения не может быть пустым.")
  .max(env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_TITLE_MAX_LENGTH, {
    message: `Название достижения должно содержать максимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_TITLE_MAX_LENGTH} символов.`,
  })
  .trim();

export const ResumeAchievementYearSchema = z.coerce
  .number({ message: "Год достижения должен быть числом." })
  .int({ message: "Год достижения должен быть целым числом." })
  .positive({ message: "Год достижения должен быть позитивным числом." })
  .refine((year) => year <= new Date().getFullYear(), {
    message: "Год достижения не может быть в будущем.",
  })
  .refine(
    (year) =>
      year >=
      new Date().getFullYear() -
        env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_DATE_MAX_YEARS_AGO,
    {
      message: `Год достижения не может быть более ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_DATE_MAX_YEARS_AGO} лет назад.`,
    },
  );

export const ResumeAchievementSchema = z.object({
  title: ResumeAchievementTitleSchema,
  year: ResumeAchievementYearSchema,
});

export type ResumeAchievement = z.infer<typeof ResumeAchievementSchema>;
