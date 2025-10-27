import { CurrentUserResponse } from "@/shared/api";

export const hasAnyPersonalData = (user: CurrentUserResponse): boolean => {
  return Object.values([
    user.full_name,
    user.birth_date,
    user.city,
    user.telegram,
    user.about,
  ]).some((value) => value !== null);
};
