import { DramaIcon } from "lucide-react";

import { UserRole } from "@/shared/api";
import Cell from "@/shared/ui/Cell";

import { getRoleDisplayName } from "../../lib/getRoleDisplayName";

export interface UserRoleCellProps
  extends Omit<React.ComponentProps<typeof Cell>, "value"> {
  value: UserRole | null;
}

const UserRoleCell: React.FunctionComponent<UserRoleCellProps> = ({
  value,
  ...otherProps
}) => {
  return (
    <Cell
      before={<DramaIcon />}
      label="Роль"
      description={getRoleDisplayName(value)}
      {...otherProps}
    />
  );
};

export default UserRoleCell;
