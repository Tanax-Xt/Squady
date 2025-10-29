"use client";

import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

import { env } from "@/shared/config/client";
import Collapse from "@/shared/ui/Collapse";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/shared/ui/input-group";

function TeamTasksField<T extends FieldValues>({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
}) {
  return (
    <Field className="gap-0" data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="team-create-form-tasks" className="mb-2">
        Задачи команды
      </FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          {...field}
          id="team-create-form-tasks"
          placeholder="Перечислите ключевые задачи и проекты, над которыми работает команда…"
          aria-invalid={fieldState.invalid}
        />

        <InputGroupAddon align="block-end">
          <InputGroupText className="tabular-nums">
            {field.value.length}/
            {env.NEXT_PUBLIC_SQUADY_API_TEAM_TEXT_FIELD_MAX_LENGTH} символов
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <Collapse>
        {fieldState.error && (
          <FieldError errors={[fieldState.error]} className="mt-2" />
        )}
      </Collapse>
    </Field>
  );
}
export { TeamTasksField };
