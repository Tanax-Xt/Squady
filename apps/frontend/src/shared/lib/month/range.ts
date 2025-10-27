import z from "zod";

import { env } from "@/shared/config/client";
import { Month, MONTHS } from "@/shared/lib/month";

type DateRange = {
  startYear: number;
  startMonth: Month;
  endYear: number | null;
  endMonth: Month | null;
};

export const superRefineItemDateRange = <T extends DateRange>(
  { startYear, startMonth, endYear, endMonth }: T,
  context: z.RefinementCtx,
) => {
  const startMonthIndex = MONTHS.indexOf(startMonth);
  const startDate = new Date(startYear, startMonthIndex);
  const today = new Date();

  if (startDate.getTime() > today.getTime()) {
    return context.addIssue({
      code: "custom",
      path: ["startYear"],
      message: "Дата начала не может быть в будущем.",
    });
  }
  const ago = new Date();

  ago.setFullYear(
    today.getFullYear() -
      env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_DATE_MAX_YEARS_AGO,
  );

  if (startDate.getTime() < ago.getTime()) {
    return context.addIssue({
      code: "custom",
      path: ["startYear"],
      message: `Дата начала должна быть максимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_DATE_MAX_YEARS_AGO} лет назад.`,
    });
  }

  if (!endYear || !endMonth) {
    return;
  }

  const endMonthIndex = MONTHS.indexOf(endMonth);
  const endDate = new Date(endYear, endMonthIndex);

  if (startDate.getTime() > endDate.getTime()) {
    return context.addIssue({
      code: "custom",
      path: ["endYear"],
      message: "Дата окончания должна быть позже или равна дате начала.",
    });
  }

  const future = new Date();

  future.setFullYear(
    today.getFullYear() +
      env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_DATE_MAX_YEARS_FUTURE,
  );

  if (endDate.getTime() > future.getTime()) {
    return context.addIssue({
      code: "custom",
      path: ["endYear"],
      message: `Дата начала должна быть максимум ${env.NEXT_PUBLIC_SQUADY_API_RESUME_ITEM_DATE_MAX_YEARS_AGO} лет в будущем.`,
    });
  }
};
