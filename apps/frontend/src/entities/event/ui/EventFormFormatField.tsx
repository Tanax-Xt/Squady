"use client";

import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/shared/ui/field";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";

import { EVENT_FORMAT_OPTIONS } from "../config/formats";

export function EventFormFormatField<T extends FieldValues>({
  field: { onChange, ...field },
  fieldState,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
}) {
  return (
    <FieldSet>
      <FieldLabel htmlFor="compute-environment-p8w">
        Формат проведения <span className="text-destructive">*</span>
      </FieldLabel>

      <FieldDescription>
        Выберите формат проведения вашего мероприятия.
      </FieldDescription>

      <RadioGroup {...field} onValueChange={onChange}>
        {EVENT_FORMAT_OPTIONS.map((option) => (
          <FieldLabel
            key={option.value}
            htmlFor={`event-form-format-${option.value}`}
          >
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldTitle>{option.label}</FieldTitle>
                <FieldDescription>{option.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem
                value={option.value}
                id={`event-form-format-${option.value}`}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
