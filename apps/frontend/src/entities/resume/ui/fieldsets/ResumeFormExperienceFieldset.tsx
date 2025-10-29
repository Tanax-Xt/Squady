import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRightIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  compareExperiences,
  ResumeExperience,
  ResumeExperienceCell,
  ResumeExperienceSchema,
} from "@/entities/resume";
import { Month } from "@/shared/lib/month";
import MonthRangeInput from "@/shared/ui/MonthRangeInput";
import SuperGroup from "@/shared/ui/SuperGroup";
import Form from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

import { ResumeFormValues } from "../../model/schema/form";

const ResumeFormExperienceFieldset: React.FunctionComponent = () => {
  const form = useFormContext<ResumeFormValues>();
  const array = useFieldArray({ control: form.control, name: "experience" });
  const state = form.getFieldState("experience");

  return (
    <SuperGroup<ResumeExperience, ResumeExperience & { id: string }>
      array={array.fields}
      state={state}
      sort={compareExperiences}
      onAppend={array.append}
      onUpdate={array.update}
      onRemove={array.remove}
      formResolver={zodResolver(ResumeExperienceSchema)}
      formDefaultValues={{
        title: "",
        description: "",
        startYear: "" as unknown as number,
        startMonth: "" as unknown as Month,
        company: "",
      }}
      renderForm={(form) => (
        <Form.Fieldset>
          <Form.Field
            control={form.control}
            required
            name="title"
            label="Роль"
            description="Коротко опишите вашу роль в проекте."
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Фронтенд разработчик"
                autoComplete="off"
              />
            )}
          />

          <Form.Field
            control={form.control}
            required
            name="description"
            label="Описание"
            description="Укажите ваши обязанности и то, чем вы занимались."
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Разрабатывал платформу, которая помогает выявлять сбои в работе сервисов."
                autoComplete="off"
              />
            )}
          />

          <MonthRangeInput form={form} />

          <Form.Field
            control={form.control}
            name="company"
            label="Место работы"
            description="Если вы работаете в компании, укажите её здесь."
            render={({ field }) => (
              <Input {...field} placeholder="Т-Банк" autoComplete="off" />
            )}
          />
        </Form.Fieldset>
      )}
      renderCell={(item, props) => (
        <ResumeExperienceCell
          as="button"
          type="button"
          size="sm"
          hoverable
          experience={item}
          after={<ChevronRightIcon />}
          {...props}
        />
      )}
      legend="Опыт"
      appendButtonChildren="Добавить опыт"
      appendTitle="Добавить опыт"
      appendDescription="Укажите информацию о вашем опыте."
      appendSubmit="Добавить опыт"
      updateTitle="Редактировать опыт"
      updateDescription="Измените информацию о вашем опыте."
      updateSubmit="Сохранить опыт"
      removeButtonChildren="Удалить опыт"
      removeTitle="Удалить опыт?"
      removeDescription="Вы уверены, что хотите удалить опыт?"
      removeAction="Да"
      removeCancel="Нет"
    />
  );
};

export default ResumeFormExperienceFieldset;
