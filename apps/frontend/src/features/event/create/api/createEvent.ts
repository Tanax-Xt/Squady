"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { getEventCacheTag } from "@/entities/event";
import { client, EventCreateRequest } from "@/shared/api";

export async function createEvent(body: EventCreateRequest) {
  const { response, data, error } = await client.POST("/events", { body });

  if (error) {
    return {
      data: null,
      error,
      status: response.status,
    };
  }

  revalidateTag(getEventCacheTag(data.id));
  redirect(`/events/${data.id}`);
}
