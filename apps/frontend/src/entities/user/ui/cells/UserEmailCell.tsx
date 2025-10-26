import { MailIcon } from "lucide-react";

import Cell from "@/shared/ui/Cell";
import CopyButton from "@/shared/ui/CopyButton";

export interface UserEmailCellProps extends React.ComponentProps<typeof Cell> {
  value: string;
}

const UserEmailCell: React.FunctionComponent<UserEmailCellProps> = ({
  value,
  ...otherProps
}) => {
  return (
    <Cell
      before={<MailIcon />}
      label="Электронная почта"
      description={value}
      after={<CopyButton side="left" value={value} />}
      {...otherProps}
    />
  );
};

export default UserEmailCell;
