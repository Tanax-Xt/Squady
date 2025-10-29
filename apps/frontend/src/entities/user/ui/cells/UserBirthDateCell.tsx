"use client";

import { CakeIcon } from "lucide-react";

import useDateTimeFormat from "@/shared/hooks/use-date-time-format";
import CopyButton from "@/shared/ui/CopyButton";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";
import Skeleton from "@/shared/ui/skeleton";

interface UserBirthDateCellProps
  extends Omit<React.ComponentProps<typeof Item>, "value"> {
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
    <Item size="sm" {...otherProps}>
      <ItemMedia className="my-auto">
        <CakeIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Дата рождения</ItemTitle>
        {displayDate ? (
          <ItemDescription>{displayDate}</ItemDescription>
        ) : (
          <Skeleton className="h-5.25 w-32" />
        )}
      </ItemContent>
      <ItemActions>
        {displayDate ? (
          <CopyButton side="left" value={displayDate} />
        ) : (
          <Skeleton className="size-9" />
        )}
      </ItemActions>
    </Item>
  );
};

export default UserBirthDateCell;
