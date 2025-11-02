"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  getResume,
  getResumeCacheTag,
  mapResumeFormValuesToResumeCreateRequest,
  mapResumeFormValuesToResumeUpdateRequest,
  ResumeFormValues,
} from "@/entities/resume";
import {
  USER_CACHE_USERS_ME_RESUMES_TAG,
  USER_CACHE_USERS_ME_TAG,
} from "@/entities/user";
import { client } from "@/shared/api";

export const updateResume = async (
  resumeId: string,
  values: ResumeFormValues,
) => {
  const { response, error } = await client.PUT("/resumes/{resume_id}", {
    params: {
      path: { resume_id: resumeId },
    },
    body: mapResumeFormValuesToResumeUpdateRequest(values),
  });

  if (!response.ok) {
    return {
      error,
      status: response.status,
    };
  }

  revalidateTag(getResumeCacheTag(resumeId));
  revalidateTag(USER_CACHE_USERS_ME_RESUMES_TAG);
  revalidateTag(USER_CACHE_USERS_ME_TAG);
  redirect(`/resumes/${resumeId}`);
};

export const toggleResumeIsPublic = async (resumeId: string) => {
  const resume = await getResume(resumeId);

  if (!resume) {
    return;
  }

  const { response, error } = await client.PUT("/resumes/{resume_id}", {
    params: {
      path: { resume_id: resumeId },
    },
    body: { ...resume, is_public: !resume.is_public },
  });

  if (!response.ok) {
    return {
      error,
      status: response.status,
    };
  }

  revalidateTag(USER_CACHE_USERS_ME_RESUMES_TAG);
  revalidateTag(USER_CACHE_USERS_ME_TAG);
  revalidateTag(getResumeCacheTag(resumeId));
};

export const deleteResume = async (resumeId: string) => {
  await client.DELETE("/resumes/{resume_id}", {
    params: { path: { resume_id: resumeId } },
  });

  revalidateTag(getResumeCacheTag(resumeId));
  revalidateTag(USER_CACHE_USERS_ME_RESUMES_TAG);
  revalidateTag(USER_CACHE_USERS_ME_TAG);
  redirect("/resumes");
};

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

  revalidateTag(USER_CACHE_USERS_ME_RESUMES_TAG);
  revalidateTag(USER_CACHE_USERS_ME_TAG);
  redirect(`/resumes/${data.id}`);
};
