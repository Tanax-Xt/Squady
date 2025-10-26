"use server";

import { revalidateTag } from "next/cache";

import { USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import {
  BodyLoginAuthLoginPost,
  client,
  serializeFormData,
  setSession,
} from "@/shared/api";
import { redirectToNextURL } from "@/shared/lib/navigation";

export async function login(body: BodyLoginAuthLoginPost) {
  const { response, data, error } = await client.POST("/auth/login", {
    body,
    bodySerializer: serializeFormData,
  });

  if (!response.ok || !data) {
    return {
      error,
      status: response.status,
    };
  }

  revalidateTag(USER_CACHE_USERS_ME_TAG);

  await setSession(data);
  await redirectToNextURL({ fallbackUrl: "/home" });
}
