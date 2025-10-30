"use server";

import { client } from "@/shared/api";

import { RESUMES_SKILLS_CACHE_TAG } from "./tags";

export async function getResumesSkills() {
  const { data } = await client.GET("/resumes/skills", {
    next: {
      tags: [RESUMES_SKILLS_CACHE_TAG],
      revalidate: 30,
    },
  });

  return data;
}
