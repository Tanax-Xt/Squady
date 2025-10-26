import { z } from "zod";

import { UserUpdatePasswordFormSchema } from "./schema";

export type UserUpdatePasswordFormFieldValues = z.infer<
  typeof UserUpdatePasswordFormSchema
>;
