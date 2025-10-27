"use client";

import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

import { getMaxBirthDate, getMinBirthDate } from "@/entities/user/";
import DatePicker from "@/shared/ui/date-picker";
import Form from "@/shared/ui/form";
import Input from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

import ResumeProfileEditFormFooter from "./ResumeProfileEditFormFooter";
import ResumeProfileEditFormHeader from "./ResumeProfileEditFormHeader";
import {
  useResumeProfileEditForm,
  UseResumeProfileEditFormProps,
} from "../model/form";

interface ResumeProfileEditFormProps
  extends UseResumeProfileEditFormProps,
    Omit<React.ComponentProps<"form">, "children"> {}

const ResumeProfileEditForm: React.FunctionComponent<
  ResumeProfileEditFormProps
> = ({ defaultValues, onSubmit, ...otherProps }) => {
  const maxBirthDate = getMaxBirthDate();
  const minBirthDate = getMinBirthDate();

  const searchParams = useSearchParams();
  const dismissible = searchParams?.get("dismissible") === "true";

  const [form, submit, pending] = useResumeProfileEditForm({ defaultValues });

  return (
    <Form
      {...form}
      onSubmit={(event) => {
        onSubmit?.(event);
        submit(event);
      }}
      {...otherProps}
    >
      <ResumeProfileEditFormHeader />

      <Form.Fieldset disabled={pending} className="mb-6">
        <Form.Field
          control={form.control}
          required
          name="full_name"
          label="ФИО"
          description={
            defaultValues?.full_name &&
            "Если вы хотите поменять ФИО, то напишите в поддержку."
          }
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Иванов Иван Иванович"
              autoComplete="name"
              spellCheck={false}
              readOnly={!!defaultValues?.full_name}
            />
          )}
        />

        <Form.Field
          control={form.control}
          required
          name="birth_date"
          label="Дата рождения"
          description={
            defaultValues?.birth_date
              ? "Если вы хотите поменять дату рождения, то напишите в поддержку."
              : "Нажмите на иконку справа, чтобы открыть календарь."
          }
          render={({ field: { onChange, ...field } }) => (
            <DatePicker
              {...field}
              title="Выберите дату"
              description="Установите дату своего рождения"
              placeholder="дд.мм.гггг"
              disabled={{
                before: minBirthDate,
                after: maxBirthDate,
              }}
              endMonth={maxBirthDate}
              startMonth={minBirthDate}
              readOnly={!!defaultValues?.full_name}
              autoComplete="bday-day bday-month bday-year"
              onChange={(date) => {
                onChange(format(date, "yyyy-MM-dd"));
              }}
            />
          )}
        />

        <Form.Field
          control={form.control}
          name="city"
          label="Город"
          description="Укажите ваш город проживания."
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Москва"
              autoComplete="address-level2"
            />
          )}
        />

        <Form.Field
          control={form.control}
          required
          name="telegram"
          label="Telegram"
          description="Укажите ваше имя пользователя в Telegram."
          render={({ field }) => (
            <Input
              {...field}
              before={<span className="select-none md:text-sm">t.me/</span>}
              className="pl-12.5 md:pl-11.5"
              placeholder="johndoe"
              autoComplete="username"
              spellCheck={false}
            />
          )}
        />

        <Form.Field
          control={form.control}
          name="about"
          label="О себе"
          description="Напишите несколько строк о себе."
          render={({ field }) => (
            <Textarea
              placeholder="Разработчик программного обеспечения, увлеченный проектами с открытым исходным кодом."
              {...field}
            />
          )}
        />
      </Form.Fieldset>

      <Form.Response />

      <ResumeProfileEditFormFooter
        form={form}
        pending={pending}
        dismissible={dismissible}
      />
    </Form>
  );
};

export default ResumeProfileEditForm;
