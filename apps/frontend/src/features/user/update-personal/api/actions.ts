"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import {
  client,
  CurrentUserPersonalDataRequest,
  CurrentUserPersonalDataUpdateRequest,
} from "@/shared/api";

export async function setCurrentUserPersonalData(
  body: CurrentUserPersonalDataRequest,
) {
  const result = await client.POST("/users/me/personal", { body });

  if (result.response.ok) {
    revalidateTag(USER_CACHE_USERS_ME_TAG);
    redirect("/resume/profile");
  } else {
    return {
      ok: result.response.ok,
      error: result.error,
      status: result.response.status,
    };
  }
}

export async function updateCurrentUserPersonalData(
  body: CurrentUserPersonalDataUpdateRequest,
) {
  const result = await client.PATCH("/users/me/personal", { body });

  if (result.response.ok) {
    revalidateTag(USER_CACHE_USERS_ME_TAG);
    redirect("/resume/profile");
  } else {
    return {
      ok: result.response.ok,
      error: result.error,
      status: result.response.status,
    };
  }
}
