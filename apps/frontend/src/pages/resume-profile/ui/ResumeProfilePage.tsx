import { redirect } from "next/navigation";

import {
  getCurrentUserVerifiedParticipantOrMentor,
  hasAnyPersonalData,
} from "@/entities/user";
import { UserProfile, UserProfileCard } from "@/widgets/profile";

const ResumeProfilePage: React.FunctionComponent = async () => {
  const user = await getCurrentUserVerifiedParticipantOrMentor();

  if (!hasAnyPersonalData(user)) {
    redirect("/resumes/profile/edit");
  }

  return (
    <>
      <UserProfileCard user={user} />

      <UserProfile user={user} />
    </>
  );
};

export default ResumeProfilePage;
