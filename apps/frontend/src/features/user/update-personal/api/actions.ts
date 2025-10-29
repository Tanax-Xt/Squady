"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  getCurrentUser,
  hasAnyPersonalData,
  USER_CACHE_USERS_ME_TAG,
} from "@/entities/user";
import { client } from "@/shared/api";

import { ResumeProfileFormValues } from "../ui/ResumeProfileForm";

export async function putCurrentUserPersonalData(
  body: ResumeProfileFormValues,
) {
  const currentUser = await getCurrentUser();

  if (hasAnyPersonalData(currentUser)) {
    await client.PATCH("/users/me/personal", { body });
  } else {
    await client.POST("/users/me/personal", { body });
  }

  revalidateTag(USER_CACHE_USERS_ME_TAG);
  redirect("/resumes/profile");
}
