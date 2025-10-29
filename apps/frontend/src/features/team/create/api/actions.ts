"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { TEAMS_CACHE_TAG, TEAMS_MY_CACHE_TAG } from "@/entities/team";
import { USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import { client, TeamCreateRequest } from "@/shared/api";

export async function createTeam(body: TeamCreateRequest) {
  const { response, data, error } = await client.POST("/teams", { body });

  if (!response.ok || !data) {
    return {
      error,
      status: response.status,
    };
  }

  revalidateTag(TEAMS_MY_CACHE_TAG);
  revalidateTag(TEAMS_CACHE_TAG);
  revalidateTag(USER_CACHE_USERS_ME_TAG);
  redirect(`/teams/${data.id}`);
}
