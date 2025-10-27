import { ResumeAchievement } from "../model/schema/achievement";

export const compareAchievements = (
  a: ResumeAchievement,
  b: ResumeAchievement,
): number => {
  return b.year - a.year || b.title.localeCompare(a.title);
};
