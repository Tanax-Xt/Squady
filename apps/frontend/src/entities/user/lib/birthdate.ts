import { env } from "@/shared/config/client";

export const getMinBirthDate = () => {
  const date = new Date();
  date.setFullYear(
    date.getFullYear() - env.NEXT_PUBLIC_SQUADY_API_USER_BIRTH_DATE_MAX_YEARS,
  );
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getMaxBirthDate = () => {
  const date = new Date();
  date.setFullYear(
    date.getFullYear() - env.NEXT_PUBLIC_SQUADY_API_USER_BIRTH_DATE_MIN_YEARS,
  );
  date.setHours(0, 0, 0, 0);
  return date;
};
