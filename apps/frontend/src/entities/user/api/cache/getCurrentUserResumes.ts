"use server";

import { cache } from "react";

import { client } from "@/shared/api";

import { USER_CACHE_USERS_ME_RESUMES_TAG } from "./tags";

export const getCurrentUserResumes = cache(async () => {
  const { data } = await client.GET("/users/me/resumes", {
    next: {
      tags: [USER_CACHE_USERS_ME_RESUMES_TAG],
      revalidate: 30,
    },
  });

  return data;
});
