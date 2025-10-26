import { z } from "zod";

import { UserPasswordSchema } from "@/entities/user";

export const LoginFormSchema = z.object({
  username: z.string().min(1, {
    message: "Введите имя пользователя или электронную почту.",
  }),
  password: UserPasswordSchema,
});
