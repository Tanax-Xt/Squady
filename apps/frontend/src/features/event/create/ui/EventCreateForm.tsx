"use client";

import { format } from "date-fns";
import { SubmitHandler } from "react-hook-form";

import { EventForm, EventFormSchemaValues } from "@/entities/event";

import { createEvent } from "../api/createEvent";

export function EventCreateForm() {
  const submit: SubmitHandler<EventFormSchemaValues> = async (values) => {
    createEvent({
      title: values.title,
      description: values.description,
      start_date: format(values.dateRange.from, "yyyy-MM-dd"),
      end_date: format(values.dateRange.to, "yyyy-MM-dd"),
      location: values.location,
      format: values.format,
    });
  };

  return <EventForm onSubmit={submit} />;
}
