import { z } from "zod";

import { env } from "@/shared/config/client";

export const TeamTitleSchema = z
  .string()
  .nonempty("Введите название команды.")
  .max(
    env.NEXT_PUBLIC_SQUADY_API_TEAM_TITLE_MAX_LENGTH,
    `Максимальная длина названия команды — ${env.NEXT_PUBLIC_SQUADY_API_TEAM_TITLE_MAX_LENGTH} символов`,
  )
  .trim();
