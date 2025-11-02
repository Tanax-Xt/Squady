import { z } from "zod";

import { env } from "@/shared/config/client";

export const eventLocationSchema = z
  .string()
  .nonempty("Введите локацию события.")
  .trim()
  .max(
    env.NEXT_PUBLIC_SQUADY_API_EVENT_ITEM_MAX_LENGTH,
    `Максимальная длина локации события — ${env.NEXT_PUBLIC_SQUADY_API_EVENT_ITEM_MAX_LENGTH} символов.`,
  );
