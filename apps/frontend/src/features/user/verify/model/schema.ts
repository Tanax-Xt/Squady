import { z } from "zod";

import { env } from "@/shared/config/client";

export const UserVerifyFormSchema = z.object({
  otp: z
    .string()
    .min(
      env.NEXT_PUBLIC_SQUADY_OTP_LENGTH,
      "Введите код подтверждения полностью.",
    ),
});
