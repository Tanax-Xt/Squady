import { HashIcon } from "lucide-react";

import Cell from "@/shared/ui/Cell";
import CopyButton from "@/shared/ui/CopyButton";

export interface UserIdCellProps
  extends Omit<React.ComponentProps<typeof Cell>, "value"> {
  value: string;
}

const UserIdCell: React.FunctionComponent<UserIdCellProps> = ({
  value,
  ...otherProps
}) => {
  return (
    <Cell
      before={<HashIcon />}
      label="Идентификатор"
      description={value}
      after={<CopyButton side="left" value={value} />}
      classNames={{
        description: "font-mono",
      }}
      {...otherProps}
    />
  );
};

export default UserIdCell;
