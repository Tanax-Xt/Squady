"use client";

import { RadioGroupItem } from "@radix-ui/react-radio-group";

import { cn } from "@/shared/lib/utils";

import { UserRoleOption } from "../model/types";

export interface UserRoleOptionRadioGroupItemProps
  extends Omit<React.ComponentProps<typeof RadioGroupItem>, "value"> {
  option: UserRoleOption;
}

const UserRoleOptionRadioGroupItem: React.FunctionComponent<
  UserRoleOptionRadioGroupItemProps
> = ({ option, className, ...otherProps }) => {
  return (
    <RadioGroupItem
      value={option.value}
      className={cn(
        "mt-4 flex w-full items-center gap-3 rounded-md border-none bg-card px-3 py-3 text-start text-card-foreground ring ring-border transition outline-none not-disabled:hover:cursor-pointer not-disabled:hover:bg-secondary focus-visible:bg-secondary disabled:cursor-not-allowed disabled:opacity-75 aria-checked:cursor-default aria-checked:ring-2 aria-checked:ring-primary not-disabled:aria-checked:bg-card",
        className,
      )}
      {...otherProps}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary p-1 ring ring-border ring-inset",
          option.iconWrapperClassName,
        )}
      >
        {<option.icon />}
      </div>
      <div className="flex flex-col">
        <span className="font-semibold">{option.label}</span>
        <span className="text-sm text-pretty text-muted-foreground">
          {option.description}
        </span>
      </div>
    </RadioGroupItem>
  );
};

export default UserRoleOptionRadioGroupItem;
