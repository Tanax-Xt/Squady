"use client";

import { format } from "date-fns";
import { SubmitHandler } from "react-hook-form";

import { EventForm, EventFormSchemaValues } from "@/entities/event";

import { updateEvent } from "../api/updateEvent";

export function EventUpdateForm({
  eventId,
  defaultValues,
}: Pick<React.ComponentProps<typeof EventForm>, "defaultValues"> & {
  eventId: string;
}) {
  const submit: SubmitHandler<EventFormSchemaValues> = async (values) => {
    updateEvent(eventId, {
      title: values.title,
      description: values.description,
      start_date: format(values.dateRange.from, "yyyy-MM-dd"),
      end_date: format(values.dateRange.to, "yyyy-MM-dd"),
      location: values.location,
      format: values.format,
    });
  };

  return <EventForm onSubmit={submit} defaultValues={defaultValues} />;
}
