"use client";

import {
  FieldValues,
  ControllerRenderProps,
  Path,
  ControllerFieldState,
} from "react-hook-form";

import { ResumeResponse } from "@/shared/api";
import Collapse from "@/shared/ui/Collapse";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/shared/ui/field";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

function ResumeIdField<T extends FieldValues>({
  field,
  fieldState,
  resumes,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
  resumes: ResumeResponse[];
}) {
  return (
    <Field className="gap-0" data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="team-create-form-resume-id" className="mb-2">
        Ваше резюме <span className="text-destructive">*</span>
      </FieldLabel>
      <SelectRoot
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
      >
        <SelectTrigger>
          <SelectValue
            id="team-create-form-resume-id"
            aria-invalid={fieldState.invalid}
            placeholder="Выберите резюме…"
          />
        </SelectTrigger>
        <SelectContent align="center">
          {resumes.map((resume) => (
            <SelectItem key={resume.id} value={resume.id}>
              {resume.role}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
      <FieldDescription className="!mt-2">
        Укажите резюме, которое актуально для этой команды.
      </FieldDescription>

      <Collapse>
        {fieldState.error && (
          <FieldError errors={[fieldState.error]} className="mt-2" />
        )}
      </Collapse>
    </Field>
  );
}

export { ResumeIdField };
