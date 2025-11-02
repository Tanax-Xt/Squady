import { z } from "zod";

import { env } from "@/shared/config/client";

export const eventDescriptionSchema = z
  .string()
  .nonempty("Введите описание события.")
  .trim()
  .max(
    env.NEXT_PUBLIC_SQUADY_API_EVENT_DESCRIPTION_MAX_LENGTH,
    `Максимальная длина описания события — ${env.NEXT_PUBLIC_SQUADY_API_EVENT_DESCRIPTION_MAX_LENGTH} символов.`,
  );
