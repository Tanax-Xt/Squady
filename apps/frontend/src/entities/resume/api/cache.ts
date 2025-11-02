"use server";

import { cache } from "react";

import { client } from "@/shared/api";

import { getResumeCacheTag, RESUMES_SKILLS_CACHE_TAG } from "./tags";

export const getResume = cache(async (resumeId: string) => {
  const { data } = await client.GET("/resumes/{resume_id}", {
    params: { path: { resume_id: resumeId } },
    next: { tags: [getResumeCacheTag(resumeId)] },
  });

  return data;
});

export async function getResumesSkills() {
  const { data } = await client.GET("/resumes/skills", {
    next: {
      tags: [RESUMES_SKILLS_CACHE_TAG],
      revalidate: 30,
    },
  });

  return data;
}
