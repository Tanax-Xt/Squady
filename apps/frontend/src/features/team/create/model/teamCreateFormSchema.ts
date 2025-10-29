import { z } from "zod";

import {
  TeamAboutSchema,
  TeamLeadResumeIdSchema,
  TeamTasksSchema,
  TeamTitleSchema,
} from "@/entities/team";

export const teamCreateFormSchema = z.object({
  title: TeamTitleSchema,
  about: TeamAboutSchema,
  tasks: TeamTasksSchema,
  leadResumeId: TeamLeadResumeIdSchema,
});
