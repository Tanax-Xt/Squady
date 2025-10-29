import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRightIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  compareAchievements,
  ResumeAchievement,
  ResumeAchievementCell,
  ResumeAchievementSchema,
} from "@/entities/resume";
import SuperGroup from "@/shared/ui/SuperGroup";
import Form from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

import { ResumeFormValues } from "../../model/schema/form";

const ResumeFormAchievementsFieldset = () => {
  const form = useFormContext<ResumeFormValues>();
  const array = useFieldArray({ control: form.control, name: "achievements" });
  const state = form.getFieldState("achievements");

  return (
    <SuperGroup
      array={array.fields}
      state={state}
      sort={compareAchievements}
      onAppend={array.append}
      onUpdate={array.update}
      onRemove={array.remove}
      formResolver={zodResolver(ResumeAchievementSchema)}
      formDefaultValues={{
        title: "",
        year: "" as unknown as ResumeAchievement["year"],
      }}
      renderForm={(form) => (
        <Form.Fieldset>
          <Form.Field
            control={form.control}
            required
            name="title"
            label="Название достижения"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Победитель олимпиады PROD"
                autoComplete="off"
              />
            )}
          />

          <Form.Field
            control={form.control}
            required
            name="year"
            label="Год достижения"
            render={({ field }) => (
              <Input
                {...field}
                inputMode="numeric"
                placeholder="2025"
                autoComplete="off"
              />
            )}
          />
        </Form.Fieldset>
      )}
      renderCell={(item, props) => (
        <ResumeAchievementCell
          as="button"
          type="button"
          size="sm"
          hoverable
          achievement={item}
          after={<ChevronRightIcon />}
          {...props}
        />
      )}
      legend="Достижения"
      appendButtonChildren="Добавить достижение"
      appendTitle="Добавить достижение"
      appendDescription="Укажите информацию о вашем достижении."
      appendSubmit="Добавить достижение"
      updateTitle="Редактировать достижение"
      updateDescription="Измените информацию о вашем достижении."
      updateSubmit="Сохранить достижение"
      removeButtonChildren="Удалить достижение"
      removeTitle="Удалить достижение?"
      removeDescription="Вы уверены, что хотите удалить достижение?"
      removeAction="Да"
      removeCancel="Нет"
    />
  );
};

export default ResumeFormAchievementsFieldset;
