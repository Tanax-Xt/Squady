export const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export type Month = (typeof MONTHS)[number];

export const MONTH_DISPLAY_NAMES: Record<Month, string> = {
  january: "Январь",
  february: "Февраль",
  march: "Март",
  april: "Апрель",
  may: "Май",
  june: "Июнь",
  july: "Июль",
  august: "Август",
  september: "Сентябрь",
  october: "Октябрь",
  november: "Ноябрь",
  december: "Декабрь",
};

export const getMonthDisplayName = (month: Month): string => {
  return MONTH_DISPLAY_NAMES[month];
};
