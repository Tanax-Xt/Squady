import { EducationType } from "../config/education";

export const EDUCATION_DISPLAY_NAMES: Record<EducationType, string> = {
  primary_school: "Младшая школа",
  medium_school: "Средняя школа",
  high_school: "Старшая школа",
  vocational_school: "Колледж",
  bachelor: "Бакалавриат",
  master: "Магистратура",
};

export const getEducationTypeDisplayName = (type: EducationType) => {
  return EDUCATION_DISPLAY_NAMES[type];
};
