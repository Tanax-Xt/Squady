"use client";

import Link from "next/link";

import { ResumeResponse } from "@/shared/api";
import useDateTimeFormat from "@/shared/hooks/use-date-time-format";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/shared/ui/item";

import { ResumePrivateIcon } from "./ResumePrivateIcon";

export const ResumeCard: React.FunctionComponent<{
  resume: ResumeResponse;
  actions?: React.ReactNode;
}> = ({ resume, actions }) => {
  const updatedAtFormat = useDateTimeFormat({
    value: resume.updated_at,
    locales: "ru",
    options: {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    },
  });

  return (
    <Item variant="muted" className="border border-border" asChild>
      <Link href={`/resumes/${resume.id}`}>
        <ItemContent>
          <ItemTitle>
            {resume.role}
            {!resume.is_public && <ResumePrivateIcon />}
          </ItemTitle>
          <ItemDescription>Обновлено {updatedAtFormat}</ItemDescription>
        </ItemContent>
        {actions && (
          <ItemActions onClick={(event) => event.stopPropagation()}>
            {actions}
          </ItemActions>
        )}
      </Link>
    </Item>
  );
};
