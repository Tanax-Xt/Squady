import { FileUserIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

export interface ResumeProfileEditFormHeaderProps
  extends React.ComponentProps<"header"> {}

const ResumeProfileEditFormHeader: React.FunctionComponent<
  ResumeProfileEditFormHeaderProps
> = ({ className, ...otherProps }) => {
  return (
    <header className={cn("mb-6 space-y-4", className)} {...otherProps}>
      <FileUserIcon className="mx-auto size-24" strokeWidth={1} />

      <hgroup className="mb-2 space-y-1 text-center">
        <h2 className="text-3xl font-semibold md:text-2xl">
          Внесите свои личные данные
        </h2>
        <p className="text-base text-pretty text-muted-foreground md:text-sm">
          Эти данные будут показываться во всех созданных вами резюме.
        </p>
      </hgroup>
    </header>
  );
};

export default ResumeProfileEditFormHeader;
