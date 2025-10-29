import { z } from "zod";

import { env } from "@/shared/config/client";

export const TeamAboutSchema = z
  .string()
  .max(
    env.NEXT_PUBLIC_SQUADY_API_TEAM_TEXT_FIELD_MAX_LENGTH,
    `Максимальная длина описания команды — ${env.NEXT_PUBLIC_SQUADY_API_TEAM_TEXT_FIELD_MAX_LENGTH} символов`,
  )
  .trim();
