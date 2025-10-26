"use client";

import { CakeIcon } from "lucide-react";

import useDateTimeFormat from "@/shared/hooks/use-date-time-format";
import Cell from "@/shared/ui/Cell";
import CopyButton from "@/shared/ui/CopyButton";
import Skeleton from "@/shared/ui/skeleton";

interface UserBirthDateCellProps
  extends Omit<React.ComponentProps<typeof Cell>, "value"> {
  value: string;
}

const UserBirthDateCell: React.FunctionComponent<UserBirthDateCellProps> = ({
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
    },
  });

  return (
    <Cell
      before={<CakeIcon />}
      label="Дата рождения"
      description={displayDate || <Skeleton className="h-6 w-32" />}
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

export default UserBirthDateCell;
