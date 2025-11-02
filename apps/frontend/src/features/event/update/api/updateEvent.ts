"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { getEventCacheTag } from "@/entities/event";
import { client, EventCreateRequest } from "@/shared/api";

export async function updateEvent(eventId: string, body: EventCreateRequest) {
  const { response, error } = await client.PUT("/events/{event_id}", {
    body,
    params: { path: { event_id: eventId } },
  });

  if (error) {
    return {
      data: null,
      error,
      status: response.status,
    };
  }

  revalidateTag(getEventCacheTag(eventId));
  redirect(`/events/${eventId}`);
}
