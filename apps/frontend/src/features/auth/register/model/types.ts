import { z } from "zod";

import { RegisterFormSchema } from "./schema";

export type RegisterFormFieldValues = z.infer<typeof RegisterFormSchema>;
