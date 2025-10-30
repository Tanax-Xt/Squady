"use server";

import { cache } from "react";

import { client } from "@/shared/api";

import { getTeamCacheTag } from "./tags";

const getTeamApplications = cache(async (teamId: string) => {
  const result = await client.GET("/teams/{team_id}/applications", {
    params: { path: { team_id: teamId } },
    next: {
      tags: [getTeamCacheTag(teamId)],
      revalidate: 30,
    },
  });

  return result.data;
});

export { getTeamApplications };
