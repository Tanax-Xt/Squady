import { MapPinIcon } from "lucide-react";

import CopyButton from "@/shared/ui/CopyButton";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";

interface UserCityCellProps
  extends Omit<React.ComponentProps<typeof Item>, "value"> {
  value: string;
}

const UserCityCell: React.FunctionComponent<UserCityCellProps> = ({
  value,
  ...otherProps
}) => {
  return (
    <Item size="sm" {...otherProps}>
      <ItemMedia className="my-auto">
        <MapPinIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Город</ItemTitle>
        <ItemDescription>{value}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <CopyButton side="left" value={value} />
      </ItemActions>
    </Item>
  );
};

export default UserCityCell;
