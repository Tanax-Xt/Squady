"use server";

import { client, serializeFormData } from "@/shared/api";

export const parsePdfResume = async (file: Blob) => {
  const { data, error, response } = await client.POST("/resumes/parse/pdf", {
    body: { file: file as unknown as string },
    bodySerializer: serializeFormData,
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
