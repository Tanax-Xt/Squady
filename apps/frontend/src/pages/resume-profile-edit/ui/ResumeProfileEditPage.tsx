import {
  getCurrentUserPersonalData,
  getCurrentUserVerifiedParticipantOrMentor,
} from "@/entities/user";
import { ResumeProfileEditForm } from "@/features/user/update-personal";

import { getDefaultValues } from "../lib/getDefaultValues";

const ResumeProfileEditPage: React.FunctionComponent = async () => {
  const [_user, personal] = await Promise.all([
    getCurrentUserVerifiedParticipantOrMentor(),
    getCurrentUserPersonalData(),
  ]);

  const defaultValues = getDefaultValues(personal);

  return <ResumeProfileEditForm defaultValues={defaultValues} />;
};

export default ResumeProfileEditPage;
