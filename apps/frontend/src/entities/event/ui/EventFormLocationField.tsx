"use client";

import {
  FieldValues,
  ControllerRenderProps,
  Path,
  ControllerFieldState,
} from "react-hook-form";

import Collapse from "@/shared/ui/Collapse";
import { Field, FieldLabel, FieldError } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

export function EventFormLocationField<T extends FieldValues>({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
}) {
  return (
    <Field className="gap-0" data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="event-form-location" className="mb-2">
        Локация <span className="text-destructive">*</span>
      </FieldLabel>
      <Input
        {...field}
        id="event-form-location"
        placeholder="Введите локацию вашего события…"
        aria-invalid={fieldState.invalid}
      />
      <Collapse>
        {fieldState.error && (
          <FieldError errors={[fieldState.error]} className="mt-2" />
        )}
      </Collapse>
    </Field>
  );
}
