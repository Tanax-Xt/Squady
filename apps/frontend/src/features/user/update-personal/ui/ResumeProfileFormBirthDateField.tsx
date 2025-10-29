"use client";

import {
  maskitoDateOptionsGenerator,
  MaskitoDateParams,
  maskitoParseDate,
} from "@maskito/kit";
import { useMaskito } from "@maskito/react";
import { format } from "date-fns";
import { CircleQuestionMarkIcon } from "lucide-react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormStateReturn,
} from "react-hook-form";
import { mergeRefs } from "react-merge-refs";

import { getMaxBirthDate, getMinBirthDate } from "@/entities/user";
import Collapse from "@/shared/ui/Collapse";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/ui/input-group";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

import { ResumeProfileFormValues } from "./ResumeProfileForm";

const maskitoDateParams: MaskitoDateParams = {
  min: getMinBirthDate(),
  max: getMaxBirthDate(),
  mode: "dd/mm/yyyy",
  separator: ".",
};

const maskitoDateOptions = maskitoDateOptionsGenerator(maskitoDateParams);

function ResumeProfileFormBirthDateField({
  field: { ref, value, onChange, ...field },
  fieldState,
  formState,
}: {
  field: ControllerRenderProps<ResumeProfileFormValues, "birth_date">;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<ResumeProfileFormValues>;
}) {
  const maskRef = useMaskito({ options: maskitoDateOptions });

  const inputRef = mergeRefs([
    ref,
    maskRef as React.RefCallback<HTMLInputElement>,
  ]);

  const disabled = !!formState.defaultValues?.birth_date;

  const defaultValue = value ? format(value, "dd.MM.yyyy") : undefined;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const date = maskitoParseDate(event.currentTarget.value, maskitoDateParams);

    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
    } else {
      onChange("");
    }
  };

  return (
    <Field data-invalid={fieldState.invalid} className="gap-0">
      <FieldLabel htmlFor="resume-profile-form-birth-date" className="mb-2">
        Дата рождения <span className="text-destructive">*</span>
      </FieldLabel>

      <InputGroup>
        <InputGroupInput
          {...field}
          id="resume-profile-form-birth-date"
          ref={inputRef}
          defaultValue={defaultValue}
          onChange={handleChange}
          readOnly={disabled}
          inputMode="decimal"
          autoComplete="bday-day bday-month bday-year"
          placeholder="дд.мм.гггг"
          aria-invalid={fieldState.invalid}
        />

        {disabled && (
          <InputGroupAddon align="inline-end">
            <TooltipRoot>
              <TooltipTrigger asChild>
                <InputGroupButton size="icon-xs">
                  <CircleQuestionMarkIcon />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>
                Изменение даты рождения недоступно — свяжятесь с поддержкой
              </TooltipContent>
            </TooltipRoot>
          </InputGroupAddon>
        )}
      </InputGroup>

      <Collapse>
        {fieldState.invalid && (
          <FieldError errors={[fieldState.error]} className="mt-3" />
        )}
      </Collapse>
    </Field>
  );
}

export { ResumeProfileFormBirthDateField };
