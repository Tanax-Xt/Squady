"use server";

import { client, operations } from "@/shared/api";

export async function getTeams(
  query: operations["get_teams_teams_get"]["parameters"]["query"],
) {
  const { data } = await client.GET("/teams", {
    params: {
      query,
    },
  });

  return data;
}
