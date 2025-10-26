import z from "zod";

import { UserPasswordSchema } from "@/entities/user";

export const UserUpdatePasswordFormSchema = z
  .object({
    oldPassword: UserPasswordSchema,
    newPassword1: UserPasswordSchema,
    newPassword2: UserPasswordSchema,
  })
  .refine((data) => data.newPassword1 === data.newPassword2, {
    message: "Подтверждение нового пароля не совпадает с новым паролем.",
    path: ["newPassword2"],
  });
