"use client";

import { SendIcon } from "lucide-react";

import CopyButton from "@/shared/ui/CopyButton";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";

interface UserTelegramCellProps
  extends Omit<React.ComponentProps<typeof Item>, "value"> {
  value: string;
}

const UserTelegramCell: React.FunctionComponent<UserTelegramCellProps> = ({
  value,
  ...otherProps
}) => {
  const href = `https://t.me/${value}`;

  return (
    <Item size="sm" {...otherProps}>
      <ItemMedia className="my-auto">
        <SendIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Telegram</ItemTitle>
        <ItemDescription>
          <a href={href} target="_blank">
            @{value}
          </a>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <CopyButton side="left" value={href} />
      </ItemActions>
    </Item>
  );
};

export default UserTelegramCell;
