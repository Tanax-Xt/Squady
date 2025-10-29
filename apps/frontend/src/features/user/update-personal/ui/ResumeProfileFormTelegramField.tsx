"use client";

import { XIcon } from "lucide-react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormStateReturn,
} from "react-hook-form";

import Collapse from "@/shared/ui/Collapse";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/shared/ui/input-group";

import { ResumeProfileFormValues } from "./ResumeProfileForm";

function ResumeProfileFormTelegramField({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<ResumeProfileFormValues, "telegram">;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<ResumeProfileFormValues>;
}) {
  const reset = () => {
    field.onChange("");
  };

  return (
    <Field data-invalid={fieldState.invalid} className="gap-0">
      <FieldLabel htmlFor="resume-profile-form-telegram" className="mb-2">
        Telegram <span className="text-destructive">*</span>
      </FieldLabel>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText className="text-sm max-md:text-base">
            t.me/
          </InputGroupText>
        </InputGroupAddon>

        <InputGroupInput
          {...field}
          id="resume-profile-form-telegram"
          autoComplete="username"
          placeholder="johndoe"
          className="!pl-0.5"
          aria-invalid={fieldState.invalid}
        />

        {field.value && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              onClick={reset}
              aria-label="Сбросить имя пользователя в Telegram"
            >
              <XIcon />
            </InputGroupButton>
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

export { ResumeProfileFormTelegramField };
