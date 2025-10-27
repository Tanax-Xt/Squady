import { getCurrentUserVerifiedParticipantOrMentor } from "@/entities/user";
import { ResumeProfileEditForm } from "@/features/user/update-personal";

import { getDefaultValues } from "../lib/getDefaultValues";

const ResumeProfileEditPage: React.FunctionComponent = async () => {
  const user = await getCurrentUserVerifiedParticipantOrMentor();

  const defaultValues = getDefaultValues({ ...user });

  return <ResumeProfileEditForm defaultValues={defaultValues} />;
};

export default ResumeProfileEditPage;
