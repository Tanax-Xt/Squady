"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser, USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import { client, CurrentUserRoleUpdateRequest } from "@/shared/api";

export async function updateCurrentUserRole(
  body: CurrentUserRoleUpdateRequest,
) {
  const { role } = await getCurrentUser();

  const { response, error } = await client.PATCH("/users/me/role", {
    body,
  });

  if (!response.ok) {
    return {
      error,
      status: response.status,
    };
  }

  revalidateTag(USER_CACHE_USERS_ME_TAG);

  if (role !== null) {
    redirect("/settings");
  } else if (body.role === "participant" || body.role === "mentor") {
    redirect("/resume/profile/edit?dismissible=true");
  }
}
