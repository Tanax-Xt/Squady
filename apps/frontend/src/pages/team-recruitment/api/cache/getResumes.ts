"use server";

import { client, operations } from "@/shared/api";

export async function getResumes(
  query: operations["get_resumes_resumes_get"]["parameters"]["query"],
) {
  const { data } = await client.GET("/resumes", {
    params: {
      query,
    },
  });

  return data;
}
