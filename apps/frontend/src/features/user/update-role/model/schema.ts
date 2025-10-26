import { z } from "zod";

import { UserRole } from "@/shared/api";

export const UserUpdateRoleSchema = z.object({
  role: z.enum([
    "agent",
    "mentor",
    "participant",
  ] as const satisfies UserRole[]),
});
