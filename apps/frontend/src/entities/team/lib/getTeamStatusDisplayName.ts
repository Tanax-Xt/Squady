import { StatusEnum } from "@/shared/api";

const TEAM_STATUS_DISPLAY_NAMES: Record<StatusEnum, string> = {
  active: "Активна",
  finished: "Завершена",
  in_check: "На проверке",
};

function getTeamStatusDisplayName(status: StatusEnum) {
  return TEAM_STATUS_DISPLAY_NAMES[status];
}

export { getTeamStatusDisplayName, TEAM_STATUS_DISPLAY_NAMES };
