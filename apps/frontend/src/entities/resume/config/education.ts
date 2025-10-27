export const EDUCATION_TYPES = [
  "primary_school",
  "medium_school",
  "high_school",
  "vocational_school",
  "bachelor",
  "master",
] as const;

export type EducationType = (typeof EDUCATION_TYPES)[number];
