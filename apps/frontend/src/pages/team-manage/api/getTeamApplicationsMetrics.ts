"use server";

import { client, operations } from "@/shared/api";

export async function getTeamApplicationsMetrics(
  teamId: string,
  query: operations["get_application_metrics_teams__team_id__applications_metrics_get"]["parameters"]["query"],
) {
  const { data } = await client.GET("/teams/{team_id}/applications/metrics", {
    params: {
      query,
      path: {
        team_id: teamId,
      },
    },
  });

  return data;
}
