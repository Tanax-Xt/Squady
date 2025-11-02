"use server";

import { client, operations } from "@/shared/api";

export async function getEvents(
  query: operations["get_events_events_get"]["parameters"]["query"],
) {
  const { data } = await client.GET("/events", {
    params: {
      query,
    },
    cache: "no-store",
  });

  return data;
}
