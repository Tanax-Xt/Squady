"use client";

import {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormStateReturn,
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

import { ResumeProfileFormValues } from "./ResumeProfileForm";

function ResumeProfileFormAboutField({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<ResumeProfileFormValues, "about">;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<ResumeProfileFormValues>;
}) {
  return (
    <Field data-invalid={fieldState.invalid} className="gap-0">
      <FieldLabel htmlFor="resume-profile-form-about" className="mb-2">
        О себе
      </FieldLabel>

      <FieldDescription className="mb-2">
        Напишите несколько строк о себе.
      </FieldDescription>

      <InputGroup>
        <InputGroupTextarea
          {...field}
          id="resume-profile-form-about"
          placeholder="Разработчик программного обеспечения, увлеченный проектами с открытым исходным кодом."
          aria-invalid={fieldState.invalid}
        />

        <InputGroupAddon align="block-end">
          <InputGroupText className="tabular-nums">
            {field.value?.length ?? 0}/
            {env.NEXT_PUBLIC_SQUADY_API_USER_ABOUT_MAX_LENGTH} символов
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <Collapse>
        {fieldState.invalid && (
          <FieldError errors={[fieldState.error]} className="mt-3" />
        )}
      </Collapse>
    </Field>
  );
}

export { ResumeProfileFormAboutField };
