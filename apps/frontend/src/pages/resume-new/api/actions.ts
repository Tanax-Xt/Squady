"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  mapResumeFormValuesToResumeCreateRequest,
  ResumeFormValues,
} from "@/entities/resume";
import { USER_CACHE_USERS_ME_TAG } from "@/entities/user";
import { client } from "@/shared/api";

export const createResume = async (values: ResumeFormValues) => {
  const { response, data, error } = await client.POST("/resumes", {
    body: mapResumeFormValuesToResumeCreateRequest(values),
  });

  if (!response.ok || !data) {
    return {
      error,
      status: response.status,
    };
  }

  revalidateTag(USER_CACHE_USERS_ME_TAG);
  redirect(`/resume/${data.id}`);
};
