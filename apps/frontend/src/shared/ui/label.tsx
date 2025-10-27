"use client";

import { Root } from "@radix-ui/react-label";
import { tv } from "tailwind-variants";

export const label = tv(
  {
    base: "flex items-center gap-1 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  },
  { twMerge: true },
);

export type LabelProps = React.ComponentProps<typeof Root>;

const Label: React.FunctionComponent<LabelProps> = ({
  className,
  ...props
}: LabelProps) => {
  return <Root data-slot="label" className={label({ className })} {...props} />;
};

export default Label;
