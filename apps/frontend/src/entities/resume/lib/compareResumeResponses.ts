import { ResumeResponse } from "@/shared/api";

export const compareResumeResponses = (
  a: ResumeResponse,
  b: ResumeResponse,
) => {
  return (
    Date.parse(b.updated_at).valueOf() - Date.parse(a.updated_at).valueOf()
  );
};
