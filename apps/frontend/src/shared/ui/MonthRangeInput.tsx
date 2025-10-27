import { useState } from "react";
import { Path, UseFormReturn } from "react-hook-form";

import { getMonthDisplayName, MONTHS } from "@/shared/lib/month";
import Cell from "@/shared/ui/Cell";
import Collapse from "@/shared/ui/Collapse";
import Group from "@/shared/ui/Group";
import Form from "@/shared/ui/form";
import Input from "@/shared/ui/input";
import Select from "@/shared/ui/select";
import Switch from "@/shared/ui/switch";

const MonthRangeInput = <
  T extends {
    startMonth: string;
    startYear: number;
    endMonth: string | null;
    endYear: number | null;
  },
>({
  form,
}: {
  form: UseFormReturn<T, unknown, T>;
}) => {
  const values = form.getValues();

  const [showEnd, setShowEnd] = useState(
    !(values.endYear === null && values.startYear !== null),
  );

  const [toggleCount, setToggleCount] = useState(0);

  const deps = ["startMonth", "startYear", "endMonth", "endYear"] as Path<T>[];

  return (
    <div className="min-w-0">
      <div className="hidden">
        {/* fix react hook form inner bug */}
        {JSON.stringify(form.formState.isValid)}
        {JSON.stringify(form.formState.isDirty)}
      </div>
      <div className="flex justify-items-start gap-2">
        <Form.Field
          control={form.control}
          rules={{ deps }}
          required
          name={"startMonth" as Path<T>}
          label="Месяц начала"
          render={({ field: { value, onChange, ...field } }) => (
            <Select
              {...field}
              defaultValue={value as string}
              onValueChange={onChange}
            >
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Январь" />
              </Select.Trigger>
              <Select.Content>
                {MONTHS.map((month) => (
                  <Select.Item key={month} value={month}>
                    {getMonthDisplayName(month)}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          )}
          className="flex-1"
        />

        <Form.Field
          control={form.control}
          rules={{ deps }}
          required
          name={"startYear" as Path<T>}
          label="Год начала"
          render={({ field: { value, ...field } }) => (
            <Input
              {...field}
              defaultValue={value as number}
              inputMode="numeric"
              placeholder="2020"
              autoComplete="off"
            />
          )}
          className="flex-1"
        />
      </div>

      <Collapse initial={toggleCount !== 0}>
        {showEnd && (
          <div className="mt-4 flex justify-items-start gap-2">
            <Form.Field
              control={form.control}
              rules={{ deps }}
              required
              name={"endMonth" as Path<T>}
              label="Месяц окончания"
              render={({ field: { value, onChange, ...field } }) => (
                <Select
                  {...field}
                  defaultValue={value as string}
                  onValueChange={onChange}
                >
                  <Select.Trigger className="w-full">
                    <Select.Value placeholder="Февраль" />
                  </Select.Trigger>
                  <Select.Content>
                    {MONTHS.map((month) => (
                      <Select.Item key={month} value={month}>
                        {getMonthDisplayName(month)}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              )}
              className="flex-1"
            />

            <Form.Field
              control={form.control}
              rules={{ deps }}
              required
              name={"endYear" as Path<T>}
              label="Год окончания"
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  defaultValue={value as number}
                  inputMode="numeric"
                  placeholder="2025"
                  autoComplete="off"
                />
              )}
              className="flex-1"
            />
          </div>
        )}
      </Collapse>

      <Group className="mt-4 min-w-0 dark:bg-input/30">
        <Cell
          as="label"
          size="sm"
          hoverable
          label="Ещё в процессе"
          after={
            <Switch
              checked={!showEnd}
              onCheckedChange={(checked) => {
                setShowEnd(!checked);
                setToggleCount((prev) => prev + 1);

                const newValue = checked ? null : "";

                // @ts-expect-error TODO: fix
                form.setValue("endMonth" as Path<T>, newValue, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });

                // @ts-expect-error TODO: fix
                form.setValue("endYear" as Path<T>, newValue, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
            />
          }
        />
      </Group>
    </div>
  );
};

export default MonthRangeInput;
