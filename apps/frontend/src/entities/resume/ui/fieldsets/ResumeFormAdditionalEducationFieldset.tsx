import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRightIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  compareAdditionalEducation,
  ResumeAdditionalEducation,
  ResumeAdditionalEducationCell,
  ResumeAdditionalEducationSchema,
} from "@/entities/resume";
import { Month } from "@/shared/lib/month";
import MonthRangeInput from "@/shared/ui/MonthRangeInput";
import SuperGroup from "@/shared/ui/SuperGroup";
import Form from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

import { ResumeFormValues } from "../../model/schema/form";

const ResumeFormAdditionalEducationFieldset = () => {
  const form = useFormContext<ResumeFormValues>();
  const array = useFieldArray({
    control: form.control,
    name: "additionalEducation",
  });
  const state = form.getFieldState("additionalEducation");

  return (
    <SuperGroup<
      ResumeAdditionalEducation,
      ResumeAdditionalEducation & { id: string }
    >
      array={array.fields}
      state={state}
      sort={compareAdditionalEducation}
      onAppend={array.append}
      onUpdate={array.update}
      onRemove={array.remove}
      formResolver={zodResolver(ResumeAdditionalEducationSchema)}
      formDefaultValues={{
        title: "",
        startYear: "" as unknown as number,
        startMonth: "" as unknown as Month,
      }}
      renderForm={(form) => (
        <Form.Fieldset>
          <Form.Field
            control={form.control}
            required
            name="title"
            label="Название"
            // description="Коротко опишите вашу роль в проекте."
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Летняя школа ФКН ВШЭ"
                autoComplete="off"
              />
            )}
          />

          <MonthRangeInput form={form} />
        </Form.Fieldset>
      )}
      renderCell={(item, props) => (
        <ResumeAdditionalEducationCell
          as="button"
          type="button"
          size="sm"
          hoverable
          additionalEducation={item}
          after={<ChevronRightIcon />}
          {...props}
        />
      )}
      legend="Дополнительное образование"
      appendButtonChildren="Добавить дополнительное образование"
      appendTitle="Добавить дополнительное образование"
      appendDescription="Укажите информацию о вашем дополнительном образовании."
      appendSubmit="Добавить дополнительное образование"
      updateTitle="Редактировать дополнительное образование"
      updateDescription="Измените информацию о вашем дополнительном образовании."
      updateSubmit="Сохранить дополнительное образование"
      removeButtonChildren="Удалить дополнительное образование"
      removeTitle="Удалить дополнительное образование?"
      removeDescription="Вы уверены, что хотите удалить дополнительное образование?"
      removeAction="Да"
      removeCancel="Нет"
    />
  );
};

export default ResumeFormAdditionalEducationFieldset;
