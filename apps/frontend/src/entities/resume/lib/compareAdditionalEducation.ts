import { MONTHS } from "@/shared/lib/month";

import { ResumeAdditionalEducation } from "../model/schema/additional-education";

export const compareAdditionalEducation = (
  a: ResumeAdditionalEducation,
  b: ResumeAdditionalEducation,
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
