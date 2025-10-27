"use client";

import React, { useId } from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerFieldState,
  type ControllerProps,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type FormProviderProps,
  type UseFormStateReturn,
} from "react-hook-form";
import { tv, type ClassValue, type VariantProps } from "tailwind-variants";

import { cn } from "@/shared/lib/utils";
import Collapse from "@/shared/ui/Collapse";
import Label, { label } from "@/shared/ui/label";

const FormRoot = <
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  className,
  clearErrors,
  control,
  formState,
  getFieldState,
  getValues,
  handleSubmit,
  register,
  reset,
  resetField,
  setError,
  setFocus,
  setValue,
  subscribe,
  trigger,
  unregister,
  watch,
  ...otherProps
}: React.ComponentProps<"form"> &
  FormProviderProps<TFieldValues, TContext, TTransformedValues>) => {
  return (
    <FormProvider<TFieldValues, TContext, TTransformedValues>
      clearErrors={clearErrors}
      control={control}
      formState={formState}
      getFieldState={getFieldState}
      getValues={getValues}
      handleSubmit={handleSubmit}
      register={register}
      reset={reset}
      resetField={resetField}
      setError={setError}
      setFocus={setFocus}
      setValue={setValue}
      subscribe={subscribe}
      trigger={trigger}
      unregister={unregister}
      watch={watch}
    >
      <form
        className={cn("flex w-full grow flex-col", className)}
        {...otherProps}
      />
    </FormProvider>
  );
};

export const field = tv({
  slots: {
    label: "mb-2 transition-colors data-[error=true]:text-destructive",
    error: "mt-2 block text-sm text-destructive",
    description: "mt-2 text-sm text-muted-foreground",
  },
  variants: {
    required: {
      true: {
        label: "after:text-destructive after:content-['*']",
      },
    },
  },
});

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  required,
  label,
  description,
  name,
  render,
  control,
  defaultValue,
  disabled,
  rules,
  shouldUnregister,
  classNames,
  ...otherProps
}: {
  render: ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<TFieldValues, TName> & {
      id: string;
      required?: boolean;
      "aria-describedby": string | undefined;
      "aria-errormessage": string | undefined;
      "aria-invalid":
        | boolean
        | "false"
        | "true"
        | "grammar"
        | "spelling"
        | undefined;
    };
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
  }) => React.ReactElement;
  label?: React.ReactNode;
  description?: React.ReactNode;
  classNames?: Partial<Record<keyof ReturnType<typeof field>, ClassValue>>;
} & Omit<ControllerProps<TFieldValues, TName>, "render"> &
  Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof field>) => {
  const id = useId();
  const formFieldId = `form-field-${id}`;
  const formFieldDescriptionId = `form-field-${id}-description`;
  const formFieldMessageId = `form-field-${id}-message`;

  const { getFieldState } = useFormContext();
  const formState = useFormState({ name });
  const fieldState = getFieldState(name, formState);
  const body = fieldState.error?.message;
  const slots = field({ required });

  return (
    <div {...otherProps}>
      {label && (
        <Label
          data-error={!!fieldState.error}
          className={slots.label({ className: classNames?.label })}
          htmlFor={formFieldId}
        >
          {label}
        </Label>
      )}

      <Controller
        name={name}
        render={({ field, fieldState, formState }) =>
          render({
            field: {
              ...field,
              id: formFieldId,
              required,
              "aria-describedby": formFieldDescriptionId,
              "aria-errormessage": fieldState.error
                ? formFieldMessageId
                : undefined,
              "aria-invalid": fieldState.error ? "true" : undefined,
            },
            fieldState,
            formState,
          })
        }
        control={control}
        defaultValue={defaultValue}
        disabled={disabled}
        rules={rules}
        shouldUnregister={shouldUnregister}
      />

      <Collapse className={slots.error({ className: classNames?.error })}>
        {body}
      </Collapse>

      {description && (
        <p
          id={formFieldDescriptionId}
          className={slots.description({ className: classNames?.description })}
        >
          {description}
        </p>
      )}
    </div>
  );
};

const FormFieldset: React.FunctionComponent<
  React.ComponentProps<"fieldset">
> = ({ className, ...otherProps }) => {
  return (
    <fieldset className={cn("min-w-0 space-y-6", className)} {...otherProps} />
  );
};

export const legend = tv(
  {
    extend: label,
    base: "mb-2 transition-colors data-[error=true]:text-destructive",
    variants: {
      asterisk: {
        true: "after:text-destructive after:content-['*']",
      },
    },
  },
  { twMerge: true },
);

export type FormLegendProps = React.ComponentProps<"legend"> &
  VariantProps<typeof legend>;

const FormLegend: React.FunctionComponent<FormLegendProps> = ({
  asterisk,
  className,
  ...otherProps
}) => {
  return <legend className={legend({ asterisk, className })} {...otherProps} />;
};

function FormResponse({
  className,
  ...otherProps
}: React.ComponentProps<typeof Collapse>) {
  const form = useFormContext();
  const error = form.formState.errors.root;

  return (
    <Collapse
      className={cn("mt-2 block text-sm text-destructive", className)}
      {...otherProps}
    >
      {error?.message as React.ReactNode}
    </Collapse>
  );
}

export { FormField, FormResponse, FormRoot };

const Form = Object.assign(FormRoot, {
  Fieldset: FormFieldset,
  Legend: FormLegend,
  Response: FormResponse,
  Field: FormField,
});

export default Form;
