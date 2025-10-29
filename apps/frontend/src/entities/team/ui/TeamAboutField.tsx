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

function TeamAboutField<T extends FieldValues>({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
}) {
  return (
    <Field className="gap-0" data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="team-create-form-about" className="mb-2">
        О команде
      </FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          {...field}
          id="team-create-form-about"
          placeholder="Опишите цели, миссию и основные направления деятельности вашей команды…"
          aria-invalid={fieldState.invalid}
        />

        <InputGroupAddon align="block-end">
          <InputGroupText className="tabular-nums">
            {field.value.length}/
            {env.NEXT_PUBLIC_SQUADY_API_TEAM_TEXT_FIELD_MAX_LENGTH} символов
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <FieldDescription className="!mt-2">
        Укажите общую информацию о вашей команде и в каком соревновании
        участвуете.
      </FieldDescription>

      <Collapse>
        {fieldState.error && (
          <FieldError errors={[fieldState.error]} className="mt-2" />
        )}
      </Collapse>
    </Field>
  );
}

export { TeamAboutField };
