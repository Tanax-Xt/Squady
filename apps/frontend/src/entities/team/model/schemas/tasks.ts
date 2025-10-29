import { z } from "zod";

import { env } from "@/shared/config/client";

export const TeamTasksSchema = z
  .string()
  .max(
    env.NEXT_PUBLIC_SQUADY_API_TEAM_TEXT_FIELD_MAX_LENGTH,
    `Максимальная длина задач команды — ${env.NEXT_PUBLIC_SQUADY_API_TEAM_TEXT_FIELD_MAX_LENGTH} символов`,
  )
  .trim();
