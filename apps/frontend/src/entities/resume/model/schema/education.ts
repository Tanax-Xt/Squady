import { z } from "zod";

import { env } from "@/shared/config/client";

import { EDUCATION_TYPES } from "../../config/education";

export const ResumeEducationTypeSchema = z.enum(EDUCATION_TYPES);

export const ResumeEducationTitleSchema = z
  .string()
  .nonempty("Название учебного заведения не может быть пустым.")
  .max(env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_TITLE_MAX_LENGTH, {
    message: `Название учебного заведения должно содержать максимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_TITLE_MAX_LENGTH} символов.`,
  })
  .trim();

export const ResumeEducationEndYearSchema = z.coerce
  .number({
    message: "Год окончания учебного заведения должен быть числовым значением.",
  })
  .int({ message: "Год окончания учебного должен быть целым числом." })
  .positive({
    message: "Год окончания учебного должен быть позитивным числом.",
  })
  .refine((year) => 1000 <= year && year <= 9999, {
    message: "Введите верный год окончания учебного.",
  })
  .superRefine((year, context) => {
    const today = new Date();

    const minYear =
      today.getFullYear() -
      env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_DATE_MAX_YEARS_AGO;
    const maxYear =
      today.getFullYear() +
      env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_DATE_MAX_YEARS_FUTURE;

    if (minYear > year) {
      return context.addIssue({
        code: "custom",
        message: `Год окончания учебного заведения должен быть максимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_DATE_MAX_YEARS_AGO} лет в прошлом.`,
      });
    }

    if (maxYear < year) {
      return context.addIssue({
        code: "custom",
        message: `Год окончания учебного заведения должен быть максимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_DATE_MAX_YEARS_FUTURE} лет в будущем.`,
      });
    }
  });
