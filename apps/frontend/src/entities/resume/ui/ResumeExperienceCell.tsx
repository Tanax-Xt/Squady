"use client";

import { StarIcon } from "lucide-react";

import { MONTHS } from "@/shared/lib/month";
import Cell from "@/shared/ui/Cell";

import { ResumeExperience } from "../model/schema/experience";

type ResumeExperienceCellProps<T extends React.ElementType = "div"> =
  React.ComponentProps<typeof Cell<T>> & {
    experience: ResumeExperience;
  };

const ResumeExperienceCell = <T extends React.ElementType = "div">({
  experience,
  ...props
}: ResumeExperienceCellProps<T>): React.ReactNode => {
  const startDate = new Date(
    experience.startYear,
    MONTHS.indexOf(experience.startMonth),
  );

  const endDate =
    experience.endMonth && experience.endYear
      ? new Date(experience.endYear, MONTHS.indexOf(experience.endMonth))
      : null;

  const dateRange = `${startDate.toLocaleDateString("ru-RU", { month: "long" })} ${startDate.toLocaleDateString("ru-RU", { year: "numeric" })}${
    endDate
      ? ` – ${endDate.toLocaleDateString("ru-RU", { month: "long" })} ${endDate.toLocaleDateString("ru-RU", { year: "numeric" })}`
      : " – по настоящее время"
  }`;

  return (
    <Cell
      before={<StarIcon />}
      label={
        <>
          {experience.title}
          {experience.company ? (
            <span className="text-muted-foreground">
              {" "}
              ({experience.company})
            </span>
          ) : null}
        </>
      }
      description={
        <>
          <span className="block first-letter:uppercase">{dateRange}</span>
          <span>{experience.description}</span>
        </>
      }
      multiline
      classNames={{ before: "mt-2.5 mb-auto", after: "mt-2.5 mb-auto" }}
      {...(props as React.ComponentProps<typeof Cell<T>>)}
    />
  );
};

export default ResumeExperienceCell;
