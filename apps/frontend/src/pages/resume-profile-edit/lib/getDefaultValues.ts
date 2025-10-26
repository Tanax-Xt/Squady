import { DefaultValues } from "react-hook-form";

import { ResumeProfileEditFormValues } from "@/features/user/update-personal";
import { CurrentUserPersonalDataResponse } from "@/shared/api";

export const getDefaultValues = (
  personal: CurrentUserPersonalDataResponse,
): DefaultValues<ResumeProfileEditFormValues> => {
  return Object.fromEntries(
    Object.entries(personal).map(([key, value]) => [
      key,
      value === null ? "" : value,
    ]),
  );
};
