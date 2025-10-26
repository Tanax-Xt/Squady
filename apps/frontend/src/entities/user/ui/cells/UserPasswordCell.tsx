import { KeyIcon } from "lucide-react";

import { env } from "@/shared/config/client";
import Cell from "@/shared/ui/Cell";

export interface UserPasswordCellProps
  extends React.ComponentProps<typeof Cell> {}

const UserPasswordCell: React.FunctionComponent<UserPasswordCellProps> = (
  props,
) => {
  return (
    <Cell
      before={<KeyIcon />}
      label="Пароль"
      description={"*".repeat(
        env.NEXT_PUBLIC_SQUADY_API_USER_PASSWORD_MIN_LENGTH,
      )}
      {...props}
    />
  );
};

export default UserPasswordCell;
