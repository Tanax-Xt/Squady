import { IdCardIcon } from "lucide-react";

import CopyButton from "@/shared/ui/CopyButton";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";

interface UserFullNameCellProps
  extends Omit<React.ComponentProps<typeof Item>, "value"> {
  value: string;
}

const UserFullNameCell: React.FunctionComponent<UserFullNameCellProps> = ({
  value,
  ...otherProps
}) => {
  return (
    <Item size="sm" {...otherProps}>
      <ItemMedia className="my-auto">
        <IdCardIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>ФИО</ItemTitle>
        <ItemDescription>{value}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <CopyButton side="left" value={value} />
      </ItemActions>
    </Item>
  );
};

export default UserFullNameCell;
