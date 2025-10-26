"use server";

import { revalidateTag } from "next/cache";

import { USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import { client, CurrentUserVerifyRequest } from "@/shared/api";

export async function verifyCurrentUser(body: CurrentUserVerifyRequest) {
  const { response, error } = await client.POST("/users/me/verify", {
    body,
  });

  if (!response.ok) {
    return {
      error,
      status: response.status,
    };
  }

  return { status: response.status };
}

export async function revalidateCurrentUser() {
  revalidateTag(USER_CACHE_USERS_ME_TAG);
}
