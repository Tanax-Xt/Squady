import { z } from "zod";

import { env } from "@/shared/config/client";

export const eventTitleSchema = z
  .string()
  .nonempty("Введите название события.")
  .trim()
  .max(
    env.NEXT_PUBLIC_SQUADY_API_EVENT_ITEM_MAX_LENGTH,
    `Максимальная длина названия события — ${env.NEXT_PUBLIC_SQUADY_API_EVENT_ITEM_MAX_LENGTH} символов`,
  );
