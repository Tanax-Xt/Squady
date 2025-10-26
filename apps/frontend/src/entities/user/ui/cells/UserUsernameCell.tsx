import { AtSignIcon } from "lucide-react";

import Cell from "@/shared/ui/Cell";
import CopyButton from "@/shared/ui/CopyButton";

export interface UserUsernameCellProps
  extends Omit<React.ComponentProps<typeof Cell>, "value"> {
  value: string;
}

const UserUsernameCell: React.FunctionComponent<UserUsernameCellProps> = ({
  value,
  ...otherProps
}) => {
  return (
    <Cell
      before={<AtSignIcon />}
      label="Имя пользователя"
      description={value}
      after={<CopyButton side="left" value={value} />}
      {...otherProps}
    />
  );
};

export default UserUsernameCell;
