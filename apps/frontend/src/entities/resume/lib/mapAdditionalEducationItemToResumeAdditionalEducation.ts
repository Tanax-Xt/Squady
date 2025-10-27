import { AdditionalEducationItem } from "@/shared/api";
import { MONTHS } from "@/shared/lib/month";

import { ResumeAdditionalEducation } from "../model/schema/additional-education";

export const mapAdditionalEducationItemToResumeAdditionalEducation = (
  additionalEducationItem: AdditionalEducationItem,
): ResumeAdditionalEducation => {
  return {
    title: additionalEducationItem.title,
    startYear: parseInt(additionalEducationItem.start_date.split("-")[0]), // Extract year
    startMonth:
      MONTHS[Number(additionalEducationItem.start_date.split("-")[1]) - 1],
    endYear: additionalEducationItem.end_date
      ? parseInt(additionalEducationItem.end_date.split("-")[0])
      : null, // Extract year
    endMonth: additionalEducationItem.end_date
      ? MONTHS[Number(additionalEducationItem.end_date.split("-")[1]) - 1]
      : null,
  };
};
