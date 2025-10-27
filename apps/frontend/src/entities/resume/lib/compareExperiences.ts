import { MONTHS } from "@/shared/lib/month";

import { ResumeExperience } from "../model/schema/experience";

export const compareExperiences = (
  a: ResumeExperience,
  b: ResumeExperience,
): number => {
  const aEndYear = a.endYear || a.startYear;
  const bEndYear = b.endYear || b.startYear;
  const aEndMonthIndex = MONTHS.indexOf(a.endMonth || a.startMonth);
  const bEndMonthIndex = MONTHS.indexOf(b.endMonth || b.startMonth);

  return (
    bEndYear - aEndYear ||
    bEndMonthIndex - aEndMonthIndex ||
    a.title.localeCompare(b.title)
  );
};
