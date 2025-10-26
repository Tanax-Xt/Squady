"use client";

import { SendIcon } from "lucide-react";
import { useMemo } from "react";

import Cell from "@/shared/ui/Cell";
import CopyButton from "@/shared/ui/CopyButton";

interface UserTelegramCellProps
  extends Omit<React.ComponentProps<typeof Cell>, "value"> {
  value: string;
}

const UserTelegramCell: React.FunctionComponent<UserTelegramCellProps> = ({
  value,
  ...otherProps
}) => {
  const href = useMemo(() => `https://t.me/${value}`, [value]);

  return (
    <Cell
      before={<SendIcon />}
      label="Telegram"
      description={
        <a
          href={href}
          target="_blank"
          className="text-muted-foreground transition hover:text-foreground"
        >
          @{value}
        </a>
      }
      after={<CopyButton side="left" value={href} />}
      {...otherProps}
    />
  );
};

export default UserTelegramCell;
