"use client";

import { MaskitoOptions } from "@maskito/core";
import {
  maskitoDateOptionsGenerator,
  MaskitoDateParams,
  maskitoParseDate,
  maskitoStringifyDate,
  maskitoWithPlaceholder,
} from "@maskito/kit";
import { useMaskito } from "@maskito/react";
import { CalendarIcon } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Matcher } from "react-day-picker";
import { RefCallBack } from "react-hook-form";
import { mergeRefs } from "react-merge-refs";

import { useIsMobile } from "@/shared/hooks/use-mobile";
import Button from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import Drawer from "@/shared/ui/drawer";
import Input from "@/shared/ui/input";
import Popover from "@/shared/ui/popover";

export interface DatePickerProps {
  id?: string | undefined;
  ref: RefCallBack;
  name?: string | undefined;
  value?: string | undefined;
  onBlur?: (...event: unknown[]) => void;
  onChange?: (value: Date) => void;
  disabled?: Matcher | Matcher[] | undefined;
  required?: boolean;
  readOnly?: boolean;
  endMonth?: Date;
  startMonth?: Date;
  title?: string;
  description?: string;
  placeholder?: string;
  separator?: string;
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
}

const DatePicker: React.FunctionComponent<DatePickerProps> = ({
  ref,
  value,
  onBlur,
  onChange,
  disabled,
  required,
  readOnly,
  endMonth,
  startMonth,
  title,
  description,
  placeholder = "dd/mm/yyyy",
  separator = ".",
  ...otherProps
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const date = useMemo(() => (value ? new Date(value) : undefined), [value]);

  const placeholderCharacters = useMemo(
    () =>
      placeholder
        .split(separator)
        .map((character) => character.at(0))
        .filter((character) => character !== undefined),
    [placeholder, separator],
  );

  const isMobile = useIsMobile();

  const maskitoDateParams: MaskitoDateParams = {
    mode: "dd/mm/yyyy",
    min: startMonth,
    max: endMonth,
    separator,
  };
  const maskitoDateOptions = maskitoDateOptionsGenerator(maskitoDateParams);

  const { plugins, ...placeholderOptions } =
    maskitoWithPlaceholder(placeholder);

  const maskitoOptions = {
    ...maskitoDateOptions,
    plugins: plugins.concat(maskitoDateOptions.plugins || []),
    preprocessors: [
      ...placeholderOptions.preprocessors,
      ...maskitoDateOptions.preprocessors,
    ],
    postprocessors: [
      ...maskitoDateOptions.postprocessors,
      ...placeholderOptions.postprocessors,
    ],
  } satisfies Required<MaskitoOptions>;

  const maskitoInputRef = useMaskito({ options: maskitoOptions });

  const Root = isMobile ? Drawer : Popover;

  const handleInputOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;

      setInputValue(value);

      const date = maskitoParseDate(value, maskitoDateParams);

      if (
        date &&
        !placeholderCharacters.some((character) => value.includes(character))
      ) {
        onChange?.(date);
      }
    },
    [onChange],
  );

  const handleCalendarOnSelect = useCallback(
    (date: unknown) => {
      if (!(date instanceof Date)) {
        return;
      }

      onChange?.(date);
      setOpen(false);
    },
    [onChange],
  );

  useEffect(() => {
    if (date) {
      setInputValue(maskitoStringifyDate(date, maskitoDateParams));
    }
  }, [date]);

  return (
    <Root open={open} onOpenChange={setOpen} modal>
      <Input
        ref={mergeRefs([
          ref,
          maskitoInputRef as React.RefCallback<HTMLInputElement>,
        ])}
        value={inputValue}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={handleInputOnChange}
        spellCheck={false}
        readOnly={readOnly}
        inputMode="decimal"
        after={
          !readOnly && (
            <Root.Trigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="-me-2.25 !size-7.5 text-muted-foreground hover:text-foreground"
              >
                <CalendarIcon />
              </Button>
            </Root.Trigger>
          )
        }
        {...otherProps}
      />

      <Root.Content
        className="w-auto overflow-hidden p-0"
        {...(!isMobile ? { align: "end", sideOffset: 8 } : {})}
      >
        {isMobile && (title || description) && (
          <Drawer.Header className="pb-0">
            {title && <Drawer.Title>{title}</Drawer.Title>}
            {description && (
              <Drawer.Description>{description}</Drawer.Description>
            )}
          </Drawer.Header>
        )}

        <Calendar
          mode="single"
          role="dialog"
          captionLayout="dropdown"
          autoFocus
          required={required}
          disabled={disabled}
          selected={date}
          endMonth={endMonth}
          startMonth={startMonth}
          defaultMonth={date}
          fixedWeeks={isMobile}
          onSelect={handleCalendarOnSelect}
          formatters={{
            formatMonthDropdown: (month) =>
              month.toLocaleDateString(undefined, {
                month: isMobile ? "long" : "short",
              }),
          }}
          className="max-md:mx-auto max-md:[--cell-size:clamp(0px,calc(100vw/7.5),46px)]"
        />
      </Root.Content>
    </Root>
  );
};

export default DatePicker;
