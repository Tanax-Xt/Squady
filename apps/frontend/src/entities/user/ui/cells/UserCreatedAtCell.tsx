"use client";

import { CalendarPlusIcon } from "lucide-react";

import useDateTimeFormat from "@/shared/hooks/use-date-time-format";
import Cell from "@/shared/ui/Cell";
import CopyButton from "@/shared/ui/CopyButton";
import Skeleton from "@/shared/ui/skeleton";

export interface UserCreatedAtCellProps
  extends Omit<React.ComponentProps<typeof Cell>, "value"> {
  value: string;
}

const UserCreatedAtCell: React.FunctionComponent<UserCreatedAtCellProps> = ({
  value,
  ...otherProps
}) => {
  const displayDate = useDateTimeFormat({
    value,
    locales: "ru",
    options: {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  });

  return (
    <Cell
      before={<CalendarPlusIcon />}
      label="Дата регистрации"
      description={displayDate || <Skeleton className="h-6 w-48" />}
      after={
        displayDate ? (
          <CopyButton side="left" value={displayDate} />
        ) : (
          <Skeleton className="size-9" />
        )
      }
      {...otherProps}
    />
  );
};

export default UserCreatedAtCell;
