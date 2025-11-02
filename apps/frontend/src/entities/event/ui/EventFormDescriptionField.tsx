"use client";

import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

import { env } from "@/shared/config/client";
import Collapse from "@/shared/ui/Collapse";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/shared/ui/input-group";

export function EventDescriptionField<T extends FieldValues>({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
}) {
  return (
    <Field className="gap-0" data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="event-form-description" className="mb-2">
        Описание <span className="text-destructive">*</span>
      </FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          {...field}
          id="event-form-description"
          rows={4}
          className="min-h-24"
          placeholder="Расскажите о вашем мероприятии: программа, цели, для кого оно предназначено…"
          aria-invalid={fieldState.invalid}
        />

        <InputGroupAddon align="block-end">
          <InputGroupText className="tabular-nums">
            {field.value.length}/
            {env.NEXT_PUBLIC_SQUADY_API_EVENT_DESCRIPTION_MAX_LENGTH} символов
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <FieldDescription className="!mt-2">
        Подробно опишите программу мероприятия и его основные особенности.
      </FieldDescription>

      <Collapse>
        {fieldState.error && (
          <FieldError errors={[fieldState.error]} className="mt-2" />
        )}
      </Collapse>
    </Field>
  );
}
