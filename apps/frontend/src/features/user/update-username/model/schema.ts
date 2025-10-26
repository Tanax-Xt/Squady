import z from "zod";

import { UserUsernameSchema } from "@/entities/user";

export const UserUpdateUsernameFormSchema = z.object({
  username: UserUsernameSchema,
});
