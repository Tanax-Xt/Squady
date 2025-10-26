import z from "zod";

import { UserUpdateUsernameFormSchema } from "./schema";

export type UserUpdateUsernameFormFieldValues = z.infer<
  typeof UserUpdateUsernameFormSchema
>;
