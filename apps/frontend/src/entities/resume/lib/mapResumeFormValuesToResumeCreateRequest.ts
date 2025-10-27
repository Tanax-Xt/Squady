import { ResumeCreateRequest } from "@/shared/api";

import { mapResumeFormValuesToResumeUpdateRequest } from "./mapResumeFormValuesToResumeUpdateRequest";
import { ResumeFormValues } from "../model/schema/form";

export const mapResumeFormValuesToResumeCreateRequest = (
  values: ResumeFormValues,
): ResumeCreateRequest => {
  const data = mapResumeFormValuesToResumeUpdateRequest(values);
  return {
    ...data,
    is_parsed: false,
  };
};
