"use client";

import { format } from "date-fns";
import {
  CalendarPlusIcon,
  CalendarRangeIcon,
  ChevronsUpDownIcon,
  FunnelXIcon,
  RadarIcon,
  SearchIcon,
  SearchXIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { ru } from "react-day-picker/locale";

import { EVENT_FORMAT_OPTIONS, EventItem, getEvents } from "@/entities/event";
import { CurrentUserResponse, EventResponse } from "@/shared/api";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import useTimeZone from "@/shared/hooks/use-time-zone";
import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/shared/ui/item";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
} from "@/shared/ui/multi-select";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/shared/ui/popover";

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function EventsPageContent({
  currentUser,
}: {
  currentUser?: CurrentUserResponse;
}) {
  const isMobile = useIsMobile();
  const timeZone = useTimeZone();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedEventFormats, setSelectedEventFormats] = useState<string[]>(
    [],
  );

  const [isMounted, setMounted] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const selectedEventFormatsApplied = !!selectedEventFormats.length;
  const filtersApplied =
    !!dateRange || selectedEventFormatsApplied || !!debouncedSearchQuery;

  const resetFilters = () => {
    setDateRange(undefined);
    setSelectedEventFormats([]);
    setSearchQuery("");
  };

  const [query, setQuery] = useState({
    format: selectedEventFormats,
    q: !!debouncedSearchQuery ? debouncedSearchQuery : undefined,
    start_date: dateRange?.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined,
    end_date: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const [events, setEvents] = useState<EventResponse[]>([]);

  useEffect(() => {
    setQuery({
      format: selectedEventFormats,
      q: !!debouncedSearchQuery ? debouncedSearchQuery : undefined,
      start_date: dateRange?.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : undefined,
      end_date: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    });
  }, [debouncedSearchQuery, dateRange, selectedEventFormats]);

  const resetLoading = () => {
    setLoading(false);
  };

  const getResponses = async () => {
    setLoading(true);
    //@ts-expect-error TODO: fix
    const data = await getEvents(query);
    setEvents(data ?? []);
    setTimeout(resetLoading, 500);
  };

  useEffect(() => {
    getResponses();
  }, [query]);

  return (
    <>
      <h1 className="text-2xl font-semibold">События</h1>

      <nav className="flex flex-col">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            placeholder="Поиск событий"
          />
        </InputGroup>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-2">
          <PopoverRoot>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-full">
                <CalendarRangeIcon className="text-muted-foreground" />

                {dateRange?.from && dateRange.to && isMounted ? (
                  `${dateRange.from.toLocaleDateString()} – ${dateRange.to.toLocaleDateString()}`
                ) : (
                  <span>Даты</span>
                )}
                <ChevronsUpDownIcon className="text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto overflow-hidden p-0"
            >
              <Calendar
                mode="range"
                locale={ru}
                selected={dateRange}
                disabled={{ before: new Date() }}
                onSelect={setDateRange}
                timeZone={timeZone ?? undefined}
                defaultMonth={dateRange?.from}
                numberOfMonths={isMobile ? 1 : 2}
              />
            </PopoverContent>
          </PopoverRoot>

          <MultiSelect
            values={selectedEventFormats}
            onValuesChange={setSelectedEventFormats}
          >
            <MultiSelectTrigger
              size="sm"
              className="gap-1.5 rounded-full transition-colors"
            >
              <RadarIcon />
              <span>
                Форматы
                {selectedEventFormatsApplied && (
                  <span className="max-md:sr-only">: </span>
                )}
              </span>
              <span className="max-md:sr-only">
                {selectedEventFormatsApplied &&
                  selectedEventFormats
                    .map(
                      (v) =>
                        EVENT_FORMAT_OPTIONS.find(
                          (option) => option.value === v,
                        )?.label,
                    )
                    .join(", ")}
              </span>
              {selectedEventFormatsApplied && (
                <Badge className="flex min-w-4 items-center justify-center !px-1 !py-0.5 leading-none tabular-nums md:hidden">
                  {selectedEventFormats.length}
                </Badge>
              )}
            </MultiSelectTrigger>
            <MultiSelectContent
              align="start"
              search={{
                placeholder: "Поиск форматов…",
                emptyMessage: "Форматы не найдены.",
              }}
              className="sm:w-max"
            >
              <MultiSelectGroup>
                {EVENT_FORMAT_OPTIONS.map((option) => (
                  <MultiSelectItem
                    key={option.value}
                    value={option.value}
                    className="gap-0"
                  >
                    <Item className="p-0">
                      <ItemContent>
                        <ItemTitle>{option.label}</ItemTitle>
                        <ItemDescription>{option.description}</ItemDescription>
                      </ItemContent>
                    </Item>
                  </MultiSelectItem>
                ))}
              </MultiSelectGroup>
            </MultiSelectContent>
          </MultiSelect>

          {filtersApplied && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-destructive!"
              onClick={resetFilters}
            >
              <FunnelXIcon />
              Сбросить
            </Button>
          )}
        </div>
      </nav>

      <ItemGroup className="-mt-2 gap-4">
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}

        {filtersApplied && !events.length && (
          <Empty>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Ничего не найдено</EmptyTitle>
              <EmptyDescription>
                Попробуйте изменить критерии поиска.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm" variant="outline" onClick={resetFilters}>
                <FunnelXIcon />
                Сбросить фильтры
              </Button>
            </EmptyContent>
          </Empty>
        )}

        {!filtersApplied && isMounted && !isLoading && !events.length && (
          <Empty>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>На платформе ещё нет событий</EmptyTitle>
              <EmptyDescription>
                {currentUser?.role === "agent"
                  ? "Будьте первыми, кто создаст событие."
                  : "Представили олимпиад ещё не создали ни одного события."}
              </EmptyDescription>
            </EmptyHeader>
            {currentUser?.role === "agent" && (
              <EmptyContent>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/events/new">
                    <CalendarPlusIcon />
                    Создать событие
                  </Link>
                </Button>
              </EmptyContent>
            )}
          </Empty>
        )}
      </ItemGroup>
    </>
  );
}
