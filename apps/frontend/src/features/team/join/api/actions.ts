"use server";

import { revalidateTag } from "next/cache";

import {
  getTeamCacheTag,
  TEAMS_CACHE_TAG,
  TEAMS_MY_CACHE_TAG,
} from "@/entities/team";
import { USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import { ApplicationCreateRequest, client } from "@/shared/api";

export async function joinTeam(teamId: string, body: ApplicationCreateRequest) {
  const { response, error } = await client.POST(
    "/teams/{team_id}/applications",
    {
      body,
      params: { path: { team_id: teamId } },
    },
  );

  if (!response.ok) {
    return {
      error,
      status: response.status,
    };
  }

  revalidateTag(TEAMS_MY_CACHE_TAG);
  revalidateTag(TEAMS_CACHE_TAG);
  revalidateTag(USER_CACHE_USERS_ME_TAG);
  revalidateTag(getTeamCacheTag(teamId));

  return {
    error: null,
    status: response.status,
  };
}
