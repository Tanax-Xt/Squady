"use server";

import { client, operations } from "@/shared/api";

export async function getTeamApplicationsMetricsFile(
  teamId: string,
  query: operations["get_application_metrics_file_teams__team_id__applications_metrics_file_get"]["parameters"]["query"],
) {
  const { data } = await client.GET(
    "/teams/{team_id}/applications/metrics/file",
    {
      params: {
        query,
        path: {
          team_id: teamId,
        },
      },
      parseAs: "blob",
    },
  );

  return data;
}
