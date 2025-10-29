"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  getTeamCacheTag,
  TEAMS_CACHE_TAG,
  TEAMS_MY_CACHE_TAG,
} from "@/entities/team";
import { USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import { client, TeamUpdateRequest } from "@/shared/api";

export async function updateTeam(teamId: string, body: TeamUpdateRequest) {
  const { response, error } = await client.PUT("/teams/{team_id}", {
    body,
    params: { path: { team_id: teamId } },
  });

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
  redirect(`/teams/${teamId}`);
}
