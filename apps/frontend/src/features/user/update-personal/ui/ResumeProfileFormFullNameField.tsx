"use client";

import { CircleQuestionMarkIcon } from "lucide-react";
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
} from "@/shared/ui/input-group";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

import { ResumeProfileFormValues } from "./ResumeProfileForm";

function ResumeProfileFormFullNameField({
  field,
  fieldState,
  formState,
}: {
  field: ControllerRenderProps<ResumeProfileFormValues, "full_name">;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<ResumeProfileFormValues>;
}) {
  const disabled = !!formState.defaultValues?.full_name;

  return (
    <Field data-invalid={fieldState.invalid} className="gap-0">
      <FieldLabel htmlFor="resume-profile-form-full-name" className="mb-2">
        ФИО <span className="text-destructive">*</span>
      </FieldLabel>

      <InputGroup>
        <InputGroupInput
          {...field}
          id="resume-profile-form-full-name"
          readOnly={disabled}
          autoComplete="name"
          placeholder="Иванов Иван Иванович"
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
                Изменение ФИО недоступно — свяжитесь с поддержкой
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

export { ResumeProfileFormFullNameField };
