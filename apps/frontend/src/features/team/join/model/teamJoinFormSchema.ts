import { z } from "zod";

import { TeamLeadResumeIdSchema } from "@/entities/team";

export const teamJoinFormSchema = z.object({
  resumeId: TeamLeadResumeIdSchema,
});

export type TeamJoinFormSchemaValues = z.infer<typeof teamJoinFormSchema>;
