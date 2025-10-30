"use client";

import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

import { ResumeResponse } from "@/shared/api";
import useDateTimeFormat from "@/shared/hooks/use-date-time-format";
import Collapse from "@/shared/ui/Collapse";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/ui/field";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/shared/ui/item";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/shared/ui/select";

function ResumeIdFieldSelectItem({ resume }: { resume: ResumeResponse }) {
  const updatedAtFormat = useDateTimeFormat({
    value: resume.updated_at,
    locales: "ru",
    options: {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    },
  });
  return (
    <SelectItem value={resume.id} className="p-0">
      <Item size="sm">
        <ItemContent>
          <ItemTitle>{resume.role}</ItemTitle>
          <ItemDescription>Обновлено {updatedAtFormat}</ItemDescription>
        </ItemContent>
      </Item>
    </SelectItem>
  );
}

function ResumeIdField<T extends FieldValues>({
  field,
  fieldState,
  resumes,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
  resumes: ResumeResponse[];
}) {
  const selectedResume = resumes.find((resume) => resume.id === field.value);

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
        <SelectTrigger className="max-md:text-base">
          {selectedResume ? selectedResume.role : "Выберите резюме…"}
        </SelectTrigger>
        <SelectContent align="center">
          {resumes.map((resume) => (
            <ResumeIdFieldSelectItem key={resume.id} resume={resume} />
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
