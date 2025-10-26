import type { UserUpdateRoleSchema } from "./schema";
import type { UserRole } from "@/shared/api";
import type { z } from "zod";

export type UserUpdateRoleFormFieldValues = z.infer<
  typeof UserUpdateRoleSchema
>;

export interface UserRoleOption {
  icon: React.ComponentType;
  iconWrapperClassName?: string | undefined;
  color: string;
  label: string;
  description: string;
  value: UserRole;
}
