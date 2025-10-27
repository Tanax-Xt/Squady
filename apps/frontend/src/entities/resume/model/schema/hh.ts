import { z } from "zod";

import { env } from "@/shared/config/client";

export const ResumeParseHeadHunterUrlSchema = z
  .string()
  .nonempty("Введите ссылку на пользователя HeadHunter.")
  .regex(
    new RegExp(env.NEXT_PUBLIC_SQUADY_API_RESUME_HH_LINK_PATTERN),
    "Формат ссылки неправильный.",
  )
  .trim();
