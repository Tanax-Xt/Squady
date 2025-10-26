import { z } from "zod";

import { ResumeProfileEditFormSchema } from "./schema";

export type ResumeProfileEditFormValues = z.infer<
  typeof ResumeProfileEditFormSchema
>;
