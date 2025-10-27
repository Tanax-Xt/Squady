import { z } from "zod";

import { env } from "@/shared/config/client";

export const ResumeParseGithubUrlSchema = z
  .string()
  .nonempty("Введите ссылку на пользователя GitHub.")
  .regex(
    new RegExp(env.NEXT_PUBLIC_SQUADY_API_RESUME_GITHUB_LINK_PATTERN),
    "Формат ссылки неправильный.",
  )
  .trim();
