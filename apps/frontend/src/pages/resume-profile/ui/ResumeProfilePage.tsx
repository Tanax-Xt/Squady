import { getCurrentUserVerifiedParticipantOrMentor } from "@/entities/user";
import { UserProfile } from "@/widgets/profile";

const ResumeProfilePage: React.FunctionComponent = async () => {
  const user = await getCurrentUserVerifiedParticipantOrMentor();

  return <UserProfile user={user} />;
};

export default ResumeProfilePage;
