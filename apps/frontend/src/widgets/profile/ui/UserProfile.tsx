import { CurrentUserResponse } from "@/shared/api";

import UserProfilePersonal from "./UserProfilePersonal";

interface UserProfileProps {
  user: CurrentUserResponse;
}

const UserProfile: React.FunctionComponent<UserProfileProps> = ({ user }) => {
  return (
    <div className="flex flex-1 grow flex-col gap-4">
      <UserProfilePersonal user={user} />
    </div>
  );
};

export default UserProfile;
