import Link from "next/link";

import {
  getCurrentUser,
  UserCreatedAtCell,
  UserEmailCell,
  UserIdCell,
  UserIsVerifiedCell,
} from "@/entities/user";
import { LogoutButton } from "@/features/auth/logout";
import { UserUpdatePasswordCell } from "@/features/user/update-password";
import { UserUpdateRoleCell } from "@/features/user/update-role";
import { UserUpdateUsernameCell } from "@/features/user/update-username";
import Group from "@/shared/ui/Group";
import { Button } from "@/shared/ui/button";
import { UserProfileCard } from "@/widgets/profile";

const SettingsPage: React.FunctionComponent = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <UserProfileCard user={currentUser} />

      <Group>
        <UserUpdateUsernameCell value={currentUser.username} />
        <UserUpdatePasswordCell />
      </Group>

      <Group>
        <UserEmailCell value={currentUser.email} />
        <UserIsVerifiedCell
          value={currentUser.is_verified}
          after={
            !currentUser.is_verified && (
              <Button asChild>
                <Link href="/settings/verify" className="-my-1.5">
                  Подтвердить
                </Link>
              </Button>
            )
          }
        />
      </Group>

      {currentUser.is_verified && (
        <Group>
          <UserUpdateRoleCell value={currentUser.role} />
        </Group>
      )}

      <Group>
        <UserCreatedAtCell value={currentUser.created_at} />
        <UserIdCell value={currentUser.id} />
      </Group>

      <LogoutButton />
    </div>
  );
};

export default SettingsPage;
