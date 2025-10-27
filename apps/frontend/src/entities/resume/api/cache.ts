"use server";

import { cache } from "react";

import { client } from "@/shared/api";

import { getResumeCacheTag } from "./tags";

export const getResume = cache(async (resumeId: string) => {
  const { data } = await client.GET("/resumes/{resume_id}", {
    params: { path: { resume_id: resumeId } },
    next: { tags: [getResumeCacheTag(resumeId)] },
  });

  return data;
});
