import { BadgeAlertIcon, BadgeCheckIcon } from "lucide-react";

import Cell from "@/shared/ui/Cell";

export interface UserIsVerifiedCellProps
  extends Omit<React.ComponentProps<typeof Cell>, "value"> {
  value: boolean;
}

const UserIsVerifiedCell: React.FunctionComponent<UserIsVerifiedCellProps> = ({
  value,
  ...otherProps
}) => {
  return (
    <Cell
      before={
        value ? (
          <BadgeCheckIcon className="text-success" />
        ) : (
          <BadgeAlertIcon className="text-destructive" />
        )
      }
      label={value ? "Почта подтверждена" : "Почта не подтверждена"}
      {...otherProps}
    />
  );
};

export default UserIsVerifiedCell;
