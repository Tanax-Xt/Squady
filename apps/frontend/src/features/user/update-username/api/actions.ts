"use server";

import { revalidateTag } from "next/cache";

import { USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import { client, CurrentUserUsernameUpdateRequest } from "@/shared/api";

export async function updateCurrentUserUsername(
  body: CurrentUserUsernameUpdateRequest,
) {
  const result = await client.PATCH("/users/me/username", { body });

  if (result.response.ok) {
    revalidateTag(USER_CACHE_USERS_ME_TAG);

    return {
      ok: result.response.ok,
      status: result.response.status,
    };
  } else {
    return {
      error: result.error,
      ok: result.response.ok,
      status: result.response.status,
    };
  }
}
