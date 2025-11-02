"use client";

import {
  CalendarRangeIcon,
  MapPinIcon,
  RadarIcon,
  TextIcon,
} from "lucide-react";

import { EVENT_FORMAT_OPTIONS } from "@/entities/event";
import { EventResponse } from "@/shared/api";
import useDateTimeFormat from "@/shared/hooks/use-date-time-format";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";

export function EventPageContent({ event }: { event: EventResponse }) {
  const startDateFormat = useDateTimeFormat({
    value: event.start_date,
    locales: "ru",
    options: {
      day: "numeric",
      month: "long",
    },
  });

  const endDateFormat = useDateTimeFormat({
    value: event.end_date,
    locales: "ru",
    options: {
      day: "numeric",
      month: "long",
    },
  });

  const eventFormatOption = EVENT_FORMAT_OPTIONS.find(
    (option) => option.value === event.format,
  );

  return (
    <>
      <h1 className="text-2xl font-semibold">{event.title}</h1>
      <Item variant="muted" className="border-border">
        <ItemMedia className="mt-1.5">
          <TextIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Описание</ItemTitle>
          <ItemDescription className="line-clamp-none">
            {event.description}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted" className="border-border">
        <ItemMedia className="mt-1.5">
          <CalendarRangeIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Даты проведения</ItemTitle>
          <ItemDescription>
            {startDateFormat} – {endDateFormat}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted" className="border-border">
        <ItemMedia className="mt-1.5">
          <MapPinIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Локация</ItemTitle>
          <ItemDescription className="line-clamp-none">
            {event.location}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted" className="border-border">
        <ItemMedia className="mt-1.5">
          <RadarIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Формат проведения</ItemTitle>
          <ItemDescription className="line-clamp-none">
            {eventFormatOption?.label} (
            {eventFormatOption?.description.replace(".", "")})
          </ItemDescription>
        </ItemContent>
      </Item>
    </>
  );
}
