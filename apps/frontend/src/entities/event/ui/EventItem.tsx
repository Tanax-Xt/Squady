import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { EventResponse } from "@/shared/api";
import useDateTimeFormat from "@/shared/hooks/use-date-time-format";
import Badge from "@/shared/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

import { EVENT_FORMAT_OPTIONS } from "../config/formats";

export function EventItem({ event }: { event: EventResponse }) {
  const startDateMonthFormat = useDateTimeFormat({
    value: event.start_date,
    locales: "ru",
    options: {
      month: "short",
    },
  });

  const startDateDayFormat = useDateTimeFormat({
    value: event.start_date,
    locales: "ru",
    options: {
      day: "numeric",
    },
  });

  const startDateWeekdayFormat = useDateTimeFormat({
    value: event.start_date,
    locales: "ru",
    options: {
      weekday: "short",
    },
  });

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
    <Item size="sm" variant="muted" className="border-border" asChild>
      <Link href={`/events/${event.id}`}>
        <ItemMedia className="flex h-full w-18 flex-col gap-1 rounded-md bg-accent/75 py-2">
          <span className="text-sm leading-none font-bold uppercase">
            {startDateMonthFormat.replace(".", "").slice(0, 3)}
          </span>
          <span className="text-3xl leading-none font-bold tabular-nums">
            {startDateDayFormat}
          </span>
          <span className="text-sm leading-none font-bold text-muted-foreground uppercase">
            {startDateWeekdayFormat}
          </span>
        </ItemMedia>
        <ItemContent>
          <TooltipRoot>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className="mt-0.5 w-fit rounded-full px-1.5"
              >
                {eventFormatOption?.label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {eventFormatOption?.description.replace(".", "")}
            </TooltipContent>
          </TooltipRoot>

          <ItemTitle className="text-lg font-semibold">{event.title}</ItemTitle>
          <ItemDescription className="text-base font-medium">
            {event.location} · {startDateFormat} – {endDateFormat}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </ItemActions>
      </Link>
    </Item>
  );
}
