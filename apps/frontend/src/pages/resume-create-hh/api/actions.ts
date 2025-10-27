"use server";

import { client } from "@/shared/api";

export const parseHeadHunterResume = async (url: string) => {
  const { data, error, response } = await client.POST("/resumes/parse/hh", {
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
