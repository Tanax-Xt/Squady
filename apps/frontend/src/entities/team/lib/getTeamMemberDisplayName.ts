import { UserPersonalDataResponse } from "@/shared/api";

export function getTeamMemberDisplayName(member: UserPersonalDataResponse) {
  return member.full_name?.split(" ").slice(0, 2).join(" ") ?? member.username;
}
