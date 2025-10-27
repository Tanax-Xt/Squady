"use client";

import { useFormContext } from "react-hook-form";

import Cell from "@/shared/ui/Cell";
import Group from "@/shared/ui/Group";
import Form from "@/shared/ui/form";
import Switch from "@/shared/ui/switch";

import { ResumeFormValues } from "../../model/schema/form";

const ResumeFormIsPublicField: React.FunctionComponent = () => {
  const form = useFormContext<ResumeFormValues>();
  const isPublic = form.watch("isPublic");

  return (
    <Form.Field
      control={form.control}
      name="isPublic"
      render={({ field: { value, onChange, ...field } }) => (
        <Group>
          <Cell
            as="label"
            size="sm"
            multiline
            hoverable
            label="Публичное резюме"
            description={
              isPublic
                ? "Другие пользователи смогут просматривать ваше резюме."
                : "Другие пользователи не смогут просматривать ваше резюме."
            }
            after={
              <Switch {...field} checked={value} onCheckedChange={onChange} />
            }
            classNames={{ root: "!items-center" }}
          />
        </Group>
      )}
    />
  );
};

export default ResumeFormIsPublicField;
