import {
  CurrentUserPersonalDataResponse,
  CurrentUserResponse,
} from "@/shared/api";

import UserProfilePersonal from "./UserProfilePersonal";
import UserProfilePlaceholder from "./UserProfilePlaceholder";
import UserProfileCard from "./card/UserProfileCard";

interface UserProfileProps {
  user: CurrentUserResponse;
  personal: CurrentUserPersonalDataResponse;
}

const UserProfile: React.FunctionComponent<UserProfileProps> = ({
  user,
  personal,
}) => {
  return (
    <div className="flex flex-1 grow flex-col gap-4">
      <UserProfileCard user={user} />

      {Object.values(personal).some((value) => value !== null) ? (
        <UserProfilePersonal personal={personal} />
      ) : (
        <UserProfilePlaceholder />
      )}
    </div>
  );
};

export default UserProfile;
