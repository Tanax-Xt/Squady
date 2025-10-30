"use server";

import { revalidateTag } from "next/cache";

import {
  TEAMS_CACHE_TAG,
  TEAMS_MY_CACHE_TAG,
  getTeamCacheTag,
} from "@/entities/team";
import { USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import { client } from "@/shared/api";

export async function kickMemberFromTeam(teamId: string, userId: string) {
  const { response, error } = await client.DELETE(
    "/teams/{team_id}/members/{user_id}",
    {
      params: { path: { team_id: teamId, user_id: userId } },
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
}
