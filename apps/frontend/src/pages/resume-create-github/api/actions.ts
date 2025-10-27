"use server";

import { client } from "@/shared/api";

export const parseGithubResume = async (url: string) => {
  const { data, error, response } = await client.POST("/resumes/parse/github", {
    body: { url },
  });

  if (error || !data) {
    return {
      data: null,
      error,
      status: response.status,
    };
  }

  return {
    data,
    error: null,
    status: response.status,
  };
};
