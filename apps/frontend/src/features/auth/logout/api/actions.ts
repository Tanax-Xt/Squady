"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import { clearSession } from "@/shared/api";

export async function logout() {
  await clearSession();

  revalidateTag(USER_CACHE_USERS_ME_TAG);

  redirect(`/login`);
}
