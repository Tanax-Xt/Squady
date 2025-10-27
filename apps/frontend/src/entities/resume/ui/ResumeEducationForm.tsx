import { useMemo } from "react";

import Button from "@/shared/ui/button";
import Form from "@/shared/ui/form";
import Input from "@/shared/ui/input";
import Select from "@/shared/ui/select";

import { EDUCATION_TYPES } from "../config/education";
import { getEducationTypeDisplayName } from "../lib/getEducationTypeDisplayName";
import {
  useResumeEducationForm,
  UseResumeEducationFormProps,
} from "../lib/useResumeEducationForm";

export interface ResumeEducationFormProps
  extends Omit<React.ComponentProps<"form">, "onSubmit" | "children">,
    UseResumeEducationFormProps {}

const ResumeEducationForm: React.FunctionComponent<
  ResumeEducationFormProps
> = ({ onSubmit, defaultValues, ...otherProps }) => {
  const [form, submit] = useResumeEducationForm({ onSubmit, defaultValues });

  const disabled = useMemo(() => {
    return !form.formState.isValid || !form.formState.isDirty;
  }, [form.formState.isValid, form.formState.isDirty]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.stopPropagation(); // prevent submitting the nested form
    submit(event);
  };

  return (
    <Form {...form} onSubmit={handleSubmit} {...otherProps}>
      <Form.Fieldset>
        <Form.Field
          control={form.control}
          required
          name="title"
          label="Название учебного заведения"
          render={({ field }) => <Input {...field} placeholder="ФКН ВШЭ" />}
        />

        <Form.Field
          control={form.control}
          required
          name="type"
          label="Тип учебного заведения"
          render={({ field: { value, onChange, ...field } }) => (
            <Select {...field} defaultValue={value} onValueChange={onChange}>
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Выберите учебное заведение" />
              </Select.Trigger>
              <Select.Content>
                {EDUCATION_TYPES.map((type) => (
                  <Select.Item key={type} value={type}>
                    {getEducationTypeDisplayName(type)}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          )}
        />

        <Form.Field
          control={form.control}
          required
          name="endYear"
          label="Год окончания учебного заведения"
          description="Если вы ещё учитесь, то введите год окончания обучения."
          render={({ field }) => (
            <Input {...field} placeholder="2022" inputMode="numeric" />
          )}
        />
      </Form.Fieldset>

      <Button type="submit" disabled={disabled} className="mt-4">
        Сохранить
      </Button>
    </Form>
  );
};

export default ResumeEducationForm;
