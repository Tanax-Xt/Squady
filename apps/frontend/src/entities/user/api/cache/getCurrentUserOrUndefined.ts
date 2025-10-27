"use server";

import { cache } from "react";

import { client } from "@/shared/api";

import { USER_CACHE_USERS_ME_TAG } from "./tags";

export const getCurrentUserOrUndefined = cache(async () => {
  const { data } = await client.GET("/users/me", {
    next: {
      tags: [USER_CACHE_USERS_ME_TAG],
      revalidate: 30,
    },
  });

  return data;
});
