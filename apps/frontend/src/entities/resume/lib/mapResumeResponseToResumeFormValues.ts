import { ResumeResponse } from "@/shared/api";

import { mapAdditionalEducationItemToResumeAdditionalEducation } from "./mapAdditionalEducationItemToResumeAdditionalEducation";
import { mapExperienceItemToResumeExperience } from "./mapExperienceItemToResumeExperience";
import { ResumeFormValues } from "../model/schema/form";

export const mapResumeResponseToResumeFormValues = (
  request: ResumeResponse,
): ResumeFormValues => {
  return {
    role: request.role,
    education: {
      type: request.education.type,
      title: request.education.title,
      endYear: request.education.end_year,
    },
    skills: request.skills.map((skill) => ({ name: skill })),
    experience:
      request.experience?.map(mapExperienceItemToResumeExperience) || null,
    achievements:
      request.achievements?.map((achievement) => ({
        title: achievement.title,
        year: achievement.year,
      })) || null,
    additionalEducation:
      request.additional_education?.map(
        mapAdditionalEducationItemToResumeAdditionalEducation,
      ) || null,
    isPublic: request.is_public,
  };
};
