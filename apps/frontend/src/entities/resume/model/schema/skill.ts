import { z } from "zod";

import { env } from "@/shared/config/client";

export const ResumeSkillSchema = z
  .string()
  .nonempty("Введите навык полностью.")
  .max(env.NEXT_PUBLIC_SQUADY_API_RESUME_SKILL_MAX_LENGTH, {
    message: `Максимальная длина навыка: ${env.NEXT_PUBLIC_SQUADY_API_RESUME_SKILL_MAX_LENGTH} символов.`,
  })
  .trim();
