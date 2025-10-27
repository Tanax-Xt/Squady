import { hasAnyPersonalData } from "@/entities/user";
import { CurrentUserResponse } from "@/shared/api";

import UserProfilePersonal from "./UserProfilePersonal";
import UserProfilePersonalEmpty from "./UserProfilePersonalEmpty";
import UserProfileCard from "./card/UserProfileCard";

interface UserProfileProps {
  user: CurrentUserResponse;
}

const UserProfile: React.FunctionComponent<UserProfileProps> = ({ user }) => {
  return (
    <div className="flex flex-1 grow flex-col gap-4">
      <UserProfileCard user={user} />

      {hasAnyPersonalData(user) ? (
        <UserProfilePersonal user={user} />
      ) : (
        <UserProfilePersonalEmpty />
      )}
    </div>
  );
};

export default UserProfile;
