import { EditIcon } from "lucide-react";
import Link from "next/link";

import { UserRoleCell } from "@/entities/user";
import IconButton from "@/shared/ui/IconButton";

export interface UserUpdateRoleCellProps
  extends React.ComponentProps<typeof UserRoleCell> {}

const UserUpdateRoleCell: React.FunctionComponent<UserUpdateRoleCellProps> = (
  props,
) => {
  return (
    <UserRoleCell
      after={
        props.value !== "admin" &&
        props.value !== "agent" && (
          <IconButton asChild side="left" title="Изменить роль">
            <Link href="/settings/role">
              <EditIcon />
            </Link>
          </IconButton>
        )
      }
      {...props}
    />
  );
};

export default UserUpdateRoleCell;
