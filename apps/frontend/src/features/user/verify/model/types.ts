import { z } from "zod";

import { UserVerifyFormSchema } from "./schema";

export type UserVerifyFormFieldValues = z.infer<typeof UserVerifyFormSchema>;
