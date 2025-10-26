import {
  getCurrentUserVerifiedParticipantOrMentor,
  getCurrentUserPersonalData,
} from "@/entities/user";
import { UserProfile } from "@/widgets/profile";

const ResumeProfilePage: React.FunctionComponent = async () => {
  const [user, personal] = await Promise.all([
    getCurrentUserVerifiedParticipantOrMentor(),
    getCurrentUserPersonalData(),
  ]);

  return <UserProfile user={user} personal={personal} />;
};

export default ResumeProfilePage;
