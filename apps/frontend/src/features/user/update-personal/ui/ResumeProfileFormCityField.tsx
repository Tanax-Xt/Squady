"use client";

import {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormStateReturn,
} from "react-hook-form";

import Collapse from "@/shared/ui/Collapse";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

import { ResumeProfileFormValues } from "./ResumeProfileForm";

function ResumeProfileFormCityField({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<ResumeProfileFormValues, "city">;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<ResumeProfileFormValues>;
}) {
  return (
    <Field data-invalid={fieldState.invalid} className="gap-0">
      <FieldLabel htmlFor="resume-profile-form-city" className="mb-2">
        Город проживания
      </FieldLabel>

      <Input
        {...field}
        id="resume-profile-form-city"
        placeholder="Москва"
        autoComplete="address-level2"
        aria-invalid={fieldState.invalid}
      />

      <Collapse>
        {fieldState.invalid && (
          <FieldError errors={[fieldState.error]} className="mt-3" />
        )}
      </Collapse>
    </Field>
  );
}

export { ResumeProfileFormCityField };
