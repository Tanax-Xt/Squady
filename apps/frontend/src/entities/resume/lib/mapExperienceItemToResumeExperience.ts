import { ExperienceItem } from "@/shared/api";
import { MONTHS } from "@/shared/lib/month";

import { ResumeExperience } from "../model/schema/experience";

export const mapExperienceItemToResumeExperience = (
  experienceItem: ExperienceItem,
): ResumeExperience => {
  return {
    title: experienceItem.title,
    description: experienceItem.description,
    startYear: parseInt(experienceItem.start_date.split("-")[0]), // Extract year
    startMonth: MONTHS[Number(experienceItem.start_date.split("-")[1]) - 1],
    endYear: experienceItem.end_date
      ? parseInt(experienceItem.end_date.split("-")[0])
      : null, // Extract year
    endMonth: experienceItem.end_date
      ? MONTHS[Number(experienceItem.end_date.split("-")[1]) - 1]
      : null,
    // Ensure company is always defined
    company: experienceItem.company || "", // Provide a fallback if undefined
  };
};
