"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { getEventCacheTag } from "@/entities/event";
import { client } from "@/shared/api";

export async function deleteEvent(eventId: string) {
  await client.DELETE("/events/{event_id}", {
    params: { path: { event_id: eventId } },
  });

  revalidateTag(getEventCacheTag(eventId));
  redirect("/events");
}
