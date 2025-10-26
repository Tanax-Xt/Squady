import { z } from "zod";

import { LoginFormSchema } from "./schema";

export type LoginFormFieldValues = z.infer<typeof LoginFormSchema>;
