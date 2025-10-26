import { IdCardIcon } from "lucide-react";

import Cell from "@/shared/ui/Cell";
import CopyButton from "@/shared/ui/CopyButton";

interface UserFullNameCellProps
  extends Omit<React.ComponentProps<typeof Cell>, "value"> {
  value: string;
}

const UserFullNameCell: React.FunctionComponent<UserFullNameCellProps> = ({
  value,
  ...otherProps
}) => {
  return (
    <Cell
      before={<IdCardIcon />}
      label="ФИО"
      description={value}
      after={<CopyButton side="left" value={value} />}
      {...otherProps}
    />
  );
};

export default UserFullNameCell;
