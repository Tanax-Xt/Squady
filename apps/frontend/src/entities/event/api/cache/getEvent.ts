"use server";

import { client } from "@/shared/api";

import { getEventCacheTag } from "./tags";

export async function getEvent(eventId: string) {
  const { data } = await client.GET("/events/{event_id}", {
    params: {
      path: { event_id: eventId },
    },
    next: {
      tags: [getEventCacheTag(eventId)],
      revalidate: 30,
    },
  });

  return data;
}
