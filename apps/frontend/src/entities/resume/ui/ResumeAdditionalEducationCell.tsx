"use client";

import { GraduationCapIcon } from "lucide-react";

import { MONTHS } from "@/shared/lib/month";
import Cell from "@/shared/ui/Cell";

import { ResumeAdditionalEducation } from "../model/schema/additional-education";

type ResumeAdditionalEducationCellProps<T extends React.ElementType = "div"> =
  React.ComponentProps<typeof Cell<T>> & {
    additionalEducation: ResumeAdditionalEducation;
  };

const ResumeAdditionalEducationCell = <T extends React.ElementType = "div">({
  additionalEducation,
  ...props
}: ResumeAdditionalEducationCellProps<T>): React.ReactNode => {
  const startDate = new Date(
    additionalEducation.startYear,
    MONTHS.indexOf(additionalEducation.startMonth),
  );

  const endDate =
    additionalEducation.endMonth && additionalEducation.endYear
      ? new Date(
          additionalEducation.endYear,
          MONTHS.indexOf(additionalEducation.endMonth),
        )
      : null;

  const dateRange = `${startDate.toLocaleDateString("ru-RU", { month: "long" })} ${startDate.toLocaleDateString("ru-RU", { year: "numeric" })}${
    endDate
      ? ` – ${endDate.toLocaleDateString("ru-RU", { month: "long" })} ${endDate.toLocaleDateString("ru-RU", { year: "numeric" })}`
      : " – по настоящее время"
  }`;

  return (
    <Cell
      before={<GraduationCapIcon />}
      label={additionalEducation.title}
      description={dateRange}
      classNames={{ description: "capitalize" }}
      {...(props as React.ComponentProps<typeof Cell<T>>)}
    />
  );
};

export default ResumeAdditionalEducationCell;
