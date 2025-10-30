"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  TEAMS_CACHE_TAG,
  TEAMS_MY_CACHE_TAG,
  getTeamCacheTag,
} from "@/entities/team";
import { USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import {
  ApplicationSendEmailRequest,
  ApplicationUpdateRequest,
  client,
} from "@/shared/api";

export async function deleteTeam(teamId: string) {
  const { response, error } = await client.DELETE("/teams/{team_id}", {
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
  redirect("/teams");
}

export async function updateTeamApplication(
  teamId: string,
  applicationId: string,
  body: ApplicationUpdateRequest,
) {
  const { response, error } = await client.PATCH(
    "/teams/{team_id}/applications/{application_id}/status",
    {
      params: { path: { team_id: teamId, application_id: applicationId } },
      body,
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

export async function sendTeamInvite(
  teamId: string,
  body: ApplicationSendEmailRequest,
) {
  const { response } = await client.POST("/teams/{team_id}/applications/send", {
    params: { path: { team_id: teamId } },
    body,
  });

  return {
    status: response.status,
  };
}
