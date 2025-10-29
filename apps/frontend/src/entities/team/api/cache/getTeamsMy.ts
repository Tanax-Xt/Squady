"use server";

import { cache } from "react";

import { client } from "@/shared/api";

import { TEAMS_MY_CACHE_TAG } from "./tags";

const getTeamsMy = cache(async () => {
  const result = await client.GET("/teams/my", {
    next: {
      tags: [TEAMS_MY_CACHE_TAG],
      revalidate: 30,
    },
  });

  return result.data;
});

export { getTeamsMy };
