import { UserRole } from "@/shared/api";

const roleDisplayNames: Record<UserRole, string> = {
  admin: "Админ",
  agent: "Представитель олимпиады",
  mentor: "Наставник",
  participant: "Участник",
} as const;

export function getRoleDisplayName(role: UserRole | null): string {
  return role ? roleDisplayNames[role] : "Роль ещё не выбрана";
}
