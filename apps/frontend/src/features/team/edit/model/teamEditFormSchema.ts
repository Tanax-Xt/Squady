import { z } from "zod";

import {
  TeamAboutSchema,
  TeamTasksSchema,
  TeamTitleSchema,
} from "@/entities/team";

export const teamEditFormSchema = z.object({
  title: TeamTitleSchema,
  about: TeamAboutSchema,
  tasks: TeamTasksSchema,
});

export type TeamEditFormSchemaValues = z.infer<typeof teamEditFormSchema>;
