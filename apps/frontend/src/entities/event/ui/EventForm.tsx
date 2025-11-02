"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import {
  Controller,
  DefaultValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shared/ui/button";
import { CardContent, CardFooter, CardRoot } from "@/shared/ui/card";
import { FieldGroup } from "@/shared/ui/field";
import Spinner from "@/shared/ui/spinner";

import { EventFormDateRangeField } from "./EventFormDateRangeField";
import { EventDescriptionField } from "./EventFormDescriptionField";
import { EventFormFormatField } from "./EventFormFormatField";
import { EventFormLocationField } from "./EventFormLocationField";
import { EventFormTitleField } from "./EventFormTitleField";
import { eventDescriptionSchema } from "../model/schemas/eventDescriptionSchema";
import { eventEndDateSchema } from "../model/schemas/eventEndDateSchema";
import { eventFormatSchema } from "../model/schemas/eventFormatSchema";
import { eventLocationSchema } from "../model/schemas/eventLocationSchema";
import { eventStartDateSchema } from "../model/schemas/eventStartDateSchema";
import { eventTitleSchema } from "../model/schemas/eventTitleSchema";

const eventFormSchema = z.object({
  title: eventTitleSchema,
  description: eventDescriptionSchema,
  location: eventLocationSchema,
  format: eventFormatSchema,
  dateRange: z.object(
    {
      from: eventStartDateSchema,
      to: eventEndDateSchema,
    },
    { message: "Введите даты проведения мероприятия." },
  ),
});

export type EventFormSchemaValues = z.infer<typeof eventFormSchema>;

export function EventForm({
  defaultValues = {
    title: "",
    description: "",
    location: "",
    format: "offline",
  },
  onSubmit,
}: {
  defaultValues?: DefaultValues<EventFormSchemaValues>;
  onSubmit?: SubmitHandler<EventFormSchemaValues>;
}) {
  const form = useForm<EventFormSchemaValues>({
    mode: "onChange",
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  });

  const [submitting, startSubmitting] = useTransition();

  const submit = form.handleSubmit((values) => {
    startSubmitting(() => {
      onSubmit?.(values);
    });
  });

  return (
    <form onSubmit={submit}>
      <CardRoot>
        <CardContent>
          <FieldGroup>
            <Controller
              control={form.control}
              name="title"
              render={EventFormTitleField}
            />

            <Controller
              control={form.control}
              name="description"
              render={EventDescriptionField}
            />

            <Controller
              control={form.control}
              name="dateRange"
              render={EventFormDateRangeField}
            />

            <Controller
              control={form.control}
              name="location"
              render={EventFormLocationField}
            />

            <Controller
              control={form.control}
              name="format"
              render={EventFormFormatField}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner />
                Создание…
              </>
            ) : (
              <>Создать</>
            )}
          </Button>
        </CardFooter>
      </CardRoot>
    </form>
  );
}
