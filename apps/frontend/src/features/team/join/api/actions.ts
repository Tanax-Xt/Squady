"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  getTeamCacheTag,
  TEAMS_CACHE_TAG,
  TEAMS_MY_CACHE_TAG,
} from "@/entities/team";
import { USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import { client, TeamAddUserRequest } from "@/shared/api";

export async function joinTeam(teamId: string, body: TeamAddUserRequest) {
  // todo: join path, not /teams/{team_id}/members
  const { response, error } = await client.POST("/teams/{team_id}/members", {
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
  redirect(`/teams/${teamId}#member-${body.user_id}`);
}
