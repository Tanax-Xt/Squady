import { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils";

const ShortcutRoot = ({
  className,
  sequence,
  ...otherProps
}: ComponentProps<"div"> & { sequence: string[] }) => {
  return (
    <div className={cn("inline-flex gap-1", className)} {...otherProps}>
      {sequence.map((key) => (
        <kbd
          key={key}
          className="inline-flex size-4 items-center justify-center rounded bg-accent/25 leading-none"
        >
          {key}
        </kbd>
      ))}
    </div>
  );
};

export { ShortcutRoot };

const Shortcut = ShortcutRoot;

export default Shortcut;
