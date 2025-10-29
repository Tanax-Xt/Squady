"use server";

import { cache } from "react";

import { client } from "@/shared/api";

import { TEAMS_CACHE_TAG } from "./tags";

const getTeams = cache(async () => {
  const result = await client.GET("/teams", {
    next: {
      tags: [TEAMS_CACHE_TAG],
      revalidate: 30,
    },
  });

  return result.data;
});

export { getTeams };
