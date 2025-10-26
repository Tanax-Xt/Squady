"use client";

import { DramaIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

export interface UserUpdateRoleFormHeaderProps
  extends Omit<React.ComponentProps<"div">, "children"> {}

const UserUpdateRoleFormHeader: React.FunctionComponent<
  UserUpdateRoleFormHeaderProps
> = ({ className, ...otherProps }) => {
  return (
    <div className={cn("space-y-4", className)} {...otherProps}>
      <DramaIcon className="mx-auto size-24" strokeWidth={1.25} />

      <hgroup className="mb-2 space-y-1 text-center">
        <h2 className="text-3xl font-semibold md:text-2xl">
          Выберите свою роль
        </h2>
        <p className="text-base text-pretty text-muted-foreground md:text-sm">
          Это поможет настроить платформу под ваши потребности
        </p>
      </hgroup>
    </div>
  );
};

export default UserUpdateRoleFormHeader;
