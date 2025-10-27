import { ResumeUpdateRequest } from "@/shared/api";
import { MONTHS } from "@/shared/lib/month";

import { ResumeFormValues } from "../model/schema/form";

export const mapResumeFormValuesToResumeUpdateRequest = (
  values: ResumeFormValues,
): ResumeUpdateRequest => {
  return {
    role: values.role,
    education: {
      type: values.education.type,
      title: values.education.title,
      end_year: values.education.endYear,
    },
    skills: values.skills.map((skill) => skill.name),
    experience: !!values.experience?.length
      ? values.experience.map((exp) => ({
          title: exp.title,
          description: exp.description,
          start_date: `${exp.startYear}-${(MONTHS.indexOf(exp.startMonth) + 1).toString().padStart(2, "0")}`,
          end_date: exp.endYear
            ? `${exp.endYear}-${(MONTHS.indexOf(exp.endMonth!) + 1).toString().padStart(2, "0")}`
            : null,
          is_work: true,
          company: exp.company || "", // Ensure company is defined
        }))
      : null,
    achievements: !!values.achievements?.length
      ? values.achievements.map((achievement) => ({
          title: achievement.title,
          year: achievement.year,
        }))
      : null,
    additional_education: !!values.additionalEducation?.length
      ? values.additionalEducation.map((additional) => ({
          title: additional.title,
          start_date: `${additional.startYear}-${(MONTHS.indexOf(additional.startMonth) + 1).toString().padStart(2, "0")}`,
          end_date: `${additional.endYear}-${(MONTHS.indexOf(additional.endMonth!) + 1).toString().padStart(2, "0")}`,
        }))
      : null,
    is_public: values.isPublic,
  };
};
