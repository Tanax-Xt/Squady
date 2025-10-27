import { ResumeParsedResponse } from "@/shared/api";

import { mapAdditionalEducationItemToResumeAdditionalEducation } from "./mapAdditionalEducationItemToResumeAdditionalEducation";
import { mapExperienceItemToResumeExperience } from "./mapExperienceItemToResumeExperience";
import { ResumeEducationFormValues } from "./useResumeEducationForm";
import { ResumeFormValues } from "../model/schema/form";

export const mapResumeParsedResponseToResumeFormValues = (
  request: ResumeParsedResponse,
): ResumeFormValues => {
  return {
    role: request.role ?? "",
    education: {
      type: "" as unknown as ResumeEducationFormValues["type"],
      title: "",
      endYear: "" as unknown as ResumeEducationFormValues["endYear"],
    },
    skills: request.skills?.map((skill) => ({ name: skill })) ?? [],
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
