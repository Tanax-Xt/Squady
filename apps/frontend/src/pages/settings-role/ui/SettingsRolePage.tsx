import { getCurrentUserVerifiedParticipantOrMentorOrNull } from "@/entities/user";
import { UserUpdateRoleForm } from "@/features/user/update-role";

const SettingsRolePage: React.FunctionComponent = async () => {
  const { role } = await getCurrentUserVerifiedParticipantOrMentorOrNull({
    forbiddenRedirectUrl: "/settings",
  });

  return <UserUpdateRoleForm defaultValues={role ? { role } : undefined} />;
};

export default SettingsRolePage;
