import { MapPinIcon } from "lucide-react";

import Cell from "@/shared/ui/Cell";
import CopyButton from "@/shared/ui/CopyButton";

interface UserCityCellProps
  extends Omit<React.ComponentProps<typeof Cell>, "value"> {
  value: string;
}

const UserCityCell: React.FunctionComponent<UserCityCellProps> = ({
  value,
  ...otherProps
}) => {
  return (
    <Cell
      before={<MapPinIcon />}
      label="Город"
      description={value}
      after={<CopyButton side="left" value={value} />}
      {...otherProps}
    />
  );
};

export default UserCityCell;
