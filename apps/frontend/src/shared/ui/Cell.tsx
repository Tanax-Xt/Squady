"use client";

import { ClassValue, tv, VariantProps } from "tailwind-variants";

export const cell = tv({
  slots: {
    root: [
      "flex min-h-14 items-center gap-2 px-3 py-2.5",
      "[&_svg:not([class*='text-'])]:text-muted-foreground",
      "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
    ],
    before: ["flex h-full items-center justify-center"],
    content: "grow overflow-hidden",
    label: "truncate",
    description: "text-muted-foreground",
    after: ["flex h-full items-center justify-center"],
  },
  variants: {
    multiline: {
      false: {
        description: "truncate",
      },
      true: {
        before: ["mt-3 items-start", "[&_svg]:mt-2"],
        description: "text-pretty whitespace-pre-line",
        after: "mt-3 items-start",
      },
    },
    hoverable: {
      true: {
        root: ["cursor-pointer", "transition", "hover:bg-accent"],
      },
      false: {
        label: "cursor-default",
        description: "cursor-default",
      },
    },
  },
});

export type CellVariantProps = VariantProps<typeof cell>;

export type CellComponentProps<T extends React.ElementType> = Omit<
  React.ComponentProps<T>,
  "children" | "className"
>;

export type CellBaseProps<T extends React.ElementType> = {
  as?: T;
  before?: React.ReactNode;
  label?: React.ReactNode;
  description?: React.ReactNode;
  after?: React.ReactNode;
  className?: ClassValue;
  classNames?: Partial<Record<keyof ReturnType<typeof cell>, ClassValue>>;
};

export type CellProps<T extends React.ElementType> = CellComponentProps<T> &
  CellBaseProps<T> &
  CellVariantProps;

const Cell = <T extends React.ElementType = "div">({
  as,
  before,
  label,
  description,
  after,
  className,
  classNames,
  multiline,
  hoverable,
  ...otherProps
}: CellProps<T>): React.ReactNode => {
  const slots = cell({ multiline, hoverable, className });

  const Comp = as ?? "div";

  return (
    <Comp
      className={slots.root({ className: classNames?.root })}
      {...otherProps}
    >
      {before && (
        <div className={slots.before({ className: classNames?.before })}>
          {before}
        </div>
      )}

      <div className={slots.content({ className: classNames?.content })}>
        <div className={slots.label({ className: classNames?.label })}>
          {label}
        </div>
        {description && (
          <div
            className={slots.description({
              className: classNames?.description,
            })}
          >
            {description}
          </div>
        )}
      </div>

      {after && (
        <div className={slots.after({ className: classNames?.after })}>
          {after}
        </div>
      )}
    </Comp>
  );
};

export default Cell;
