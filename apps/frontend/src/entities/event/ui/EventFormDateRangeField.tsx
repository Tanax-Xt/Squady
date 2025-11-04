"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { ru } from "react-day-picker/locale";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

import { useIsMobile } from "@/shared/hooks/use-mobile";
import useTimeZone from "@/shared/hooks/use-time-zone";
import Collapse from "@/shared/ui/Collapse";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/shared/ui/popover";

export function EventFormDateRangeField<T extends FieldValues>({
  field: { value, disabled, onChange, ...field },
  fieldState,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
}) {
  const isMobile = useIsMobile();
  const timeZone = useTimeZone();
  const [isMounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    value ?? undefined,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (dateRange !== value) {
      onChange(dateRange);
    }
  }, [dateRange]);

  return (
    <Field className="gap-0" data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="event-form-date-range" className="mb-2">
        Даты проведения <span className="text-destructive">*</span>
      </FieldLabel>
      <PopoverRoot>
        <PopoverTrigger asChild>
          <Button
            id="event-form-date-range"
            type="button"
            variant="outline"
            className="justify-between overflow-hidden font-normal max-md:text-base [[data-invalid=true]]:border-destructive"
            data-invalid={fieldState.invalid}
          >
            {dateRange?.from && dateRange.to && isMounted ? (
              `${dateRange.from.toLocaleDateString()} – ${dateRange.to.toLocaleDateString()}`
            ) : (
              <span className="text-muted-foreground">
                Выберите промежуток проведения события…
              </span>
            )}
            <ChevronsUpDownIcon className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto overflow-hidden p-0">
          <Calendar
            {...field}
            mode="range"
            locale={ru}
            selected={dateRange}
            disabled={disabled || { before: new Date() }}
            onSelect={setDateRange}
            timeZone={timeZone ?? undefined}
            defaultMonth={dateRange?.from}
            numberOfMonths={isMobile ? 1 : 2}
          />
        </PopoverContent>
      </PopoverRoot>

      <Collapse>
        {fieldState.error && (
          <FieldError errors={[fieldState.error]} className="mt-2" />
        )}
      </Collapse>
    </Field>
  );
}
