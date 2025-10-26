import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/button";
import Spinner from "@/shared/ui/spinner";

import { ResumeProfileEditFormValues } from "../model/types";

export interface ResumeProfileEditFormFooterProps
  extends React.ComponentProps<"footer"> {
  form: UseFormReturn<ResumeProfileEditFormValues>;
  pending: boolean;
  dismissible?: boolean;
}

const ResumeProfileEditFormFooter: React.FunctionComponent<
  ResumeProfileEditFormFooterProps
> = ({ form, pending, dismissible, className, ...otherProps }) => {
  return (
    <footer
      className={cn(
        "flex max-w-dvw gap-2 max-md:sticky max-md:bottom-0 max-md:-mx-4 max-md:mt-auto max-md:-mb-4 max-md:border-t max-md:bg-background max-md:p-4",
        className,
      )}
      {...otherProps}
    >
      {dismissible && (
        <Button asChild size="lg" variant="outline" className="flex-1">
          <Link href="/home">Заполнить позже</Link>
        </Button>
      )}

      <Button
        size="lg"
        loading={pending}
        disabled={!form.formState.isValid || !form.formState.isDirty}
        className="flex-1"
      >
        {pending ? (
          <>
            <Spinner />
            <span>Сохранение…</span>
          </>
        ) : (
          <>Сохранить</>
        )}
      </Button>
    </footer>
  );
};

export default ResumeProfileEditFormFooter;
