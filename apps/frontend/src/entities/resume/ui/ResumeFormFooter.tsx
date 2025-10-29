"use client";

import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import Spinner from "@/shared/ui/spinner";

import { ResumeFormValues } from "../model/schema/form";

export interface ResumeFormFooterProps extends React.ComponentProps<"footer"> {
  loading?: boolean;
}

const ResumeFormFooter: React.FunctionComponent<ResumeFormFooterProps> = ({
  className,
  loading,
  ...otherProps
}) => {
  const form = useFormContext<ResumeFormValues>();

  const disabled = useMemo(() => {
    return !form.formState.isValid || !form.formState.isDirty;
  }, [form.formState.isValid, form.formState.isDirty]);

  return (
    <footer
      className={cn(
        "flex max-w-dvw gap-2 max-md:sticky max-md:bottom-0 max-md:-mx-4 max-md:mt-auto max-md:-mb-4 max-md:border-t max-md:bg-background max-md:p-4",
        className,
      )}
      {...otherProps}
    >
      <Button type="submit" disabled={disabled || loading} className="w-full">
        {loading && <Spinner />}
        Сохранить
      </Button>
    </footer>
  );
};

export default ResumeFormFooter;
