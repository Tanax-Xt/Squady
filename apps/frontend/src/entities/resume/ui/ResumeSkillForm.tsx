"use client";

import { useMemo } from "react";

import Button from "@/shared/ui/button";
import Form from "@/shared/ui/form";
import Input from "@/shared/ui/input";

import { useRandomSkillNameInterval } from "../lib/useRandomSkillNameInterval";
import {
  useResumeSkillForm,
  UseResumeSkillFormProps,
} from "../lib/useResumeSkillForm";

export interface ResumeSkillFormProps
  extends Omit<React.ComponentProps<"form">, "onSubmit" | "children">,
    UseResumeSkillFormProps {}

const ResumeSkillForm: React.FunctionComponent<ResumeSkillFormProps> = ({
  onSubmit,
  defaultValues,
  ...otherProps
}) => {
  const [form, submit] = useResumeSkillForm({ onSubmit, defaultValues });

  const disabled = useMemo(() => {
    return !form.formState.isValid || !form.formState.isDirty;
  }, [form.formState.isValid, form.formState.isDirty]);

  const placeholder = useRandomSkillNameInterval();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.stopPropagation(); // prevent submitting the nested form
    submit(event);
  };

  return (
    <Form {...form} onSubmit={handleSubmit} {...otherProps}>
      <Form.Fieldset>
        <Form.Field
          control={form.control}
          name="name"
          label="Навык"
          render={({ field }) => (
            <Input {...field} placeholder={placeholder} spellCheck={false} />
          )}
        />
      </Form.Fieldset>

      <Button type="submit" disabled={disabled} className="mt-4">
        Добавить
      </Button>
    </Form>
  );
};

export default ResumeSkillForm;
