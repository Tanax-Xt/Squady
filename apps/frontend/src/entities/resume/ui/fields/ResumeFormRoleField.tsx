"use client";

import { useFormContext } from "react-hook-form";

import Form from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

import { ResumeFormValues } from "../../model/schema/form";

export interface ResumeFormRoleFieldProps {}

const ResumeFormRoleField: React.FunctionComponent<
  ResumeFormRoleFieldProps
> = () => {
  const form = useFormContext<ResumeFormValues>();

  return (
    <Form.Field
      control={form.control}
      required
      name="role"
      label="Роль"
      description="Это поле будет отображаться в качестве названия резюме."
      render={({ field }) => (
        <Input
          {...field}
          placeholder="Фронтенд-разработчик"
          spellCheck={false}
        />
      )}
    />
  );
};

export default ResumeFormRoleField;
