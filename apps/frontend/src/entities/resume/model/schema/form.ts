"use client";

import { z } from "zod";

import {
  ResumeAchievementSchema,
  ResumeAdditionalEducationSchema,
  ResumeEducationFormSchema,
  ResumeExperienceSchema,
} from "@/entities/resume";
import { env } from "@/shared/config/client";

export const ResumeFormSchema = z.object({
  role: z.string(),
  education: ResumeEducationFormSchema,
  skills: z
    .array(
      z.object({
        name: z
          .string()
          .nonempty("Введите навык полностью.")
          .max(env.NEXT_PUBLIC_SQUADY_API_RESUME_SKILL_MAX_LENGTH, {
            message: `Максимальная длина навыка: ${env.NEXT_PUBLIC_SQUADY_API_RESUME_SKILL_MAX_LENGTH} символов.`,
          })
          .trim(),
      }),
    )
    .min(env.NEXT_PUBLIC_SQUADY_API_RESUME_SKILLS_MIN_COUNT, {
      message: `В резюме должен быть минимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_SKILLS_MIN_COUNT} навык.`,
    })
    .max(env.NEXT_PUBLIC_SQUADY_API_RESUME_SKILLS_MAX_COUNT, {
      message: `В резюме должно быть максимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_SKILLS_MAX_COUNT} навыков.`,
    }),
  experience: z
    .array(ResumeExperienceSchema)
    .superRefine((array, context) => {
      if (!array.length) {
        return;
      }

      if (
        array.length < env.NEXT_PUBLIC_SQUADY_API_RESUME_EXPERIENCES_MIN_COUNT
      ) {
        context.addIssue({
          code: "custom",
          message: `В резюме должно быть минимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_EXPERIENCES_MIN_COUNT} опыт работы.`,
        });
      }

      if (
        array.length > env.NEXT_PUBLIC_SQUADY_API_RESUME_EXPERIENCES_MAX_COUNT
      ) {
        context.addIssue({
          code: "custom",
          message: `В резюме должно быть максимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_EXPERIENCES_MAX_COUNT} опыта работы.`,
        });
      }
    })
    .nullish(),
  achievements: z
    .array(ResumeAchievementSchema)
    .superRefine((array, context) => {
      if (!array.length) {
        return;
      }

      if (
        array.length < env.NEXT_PUBLIC_SQUADY_API_RESUME_ACHIEVEMENTS_MIN_COUNT
      ) {
        context.addIssue({
          code: "custom",
          message: `В резюме должно быть минимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ACHIEVEMENTS_MIN_COUNT} достижение.`,
        });
      }

      if (
        array.length > env.NEXT_PUBLIC_SQUADY_API_RESUME_ACHIEVEMENTS_MAX_COUNT
      ) {
        context.addIssue({
          code: "custom",
          message: `В резюме должно быть максимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ACHIEVEMENTS_MAX_COUNT} достижений.`,
        });
      }
    })
    .nullish(),
  additionalEducation: z
    .array(ResumeAdditionalEducationSchema)
    .superRefine((array, context) => {
      if (!array.length) {
        return;
      }

      if (
        array.length <
        env.NEXT_PUBLIC_SQUADY_API_RESUME_ADDITIONAL_EDUCATIONS_MIN_COUNT
      ) {
        context.addIssue({
          code: "custom",
          message: `В резюме должно быть минимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ADDITIONAL_EDUCATIONS_MIN_COUNT} дополнительное образование.`,
        });
      }

      if (
        array.length >
        env.NEXT_PUBLIC_SQUADY_API_RESUME_ADDITIONAL_EDUCATIONS_MAX_COUNT
      ) {
        context.addIssue({
          code: "custom",
          message: `В резюме должно быть максимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ADDITIONAL_EDUCATIONS_MAX_COUNT} дополнительных образований.`,
        });
      }
    })
    .nullish(),
  isPublic: z.boolean(),
});

export type ResumeFormValues = z.infer<typeof ResumeFormSchema>;
