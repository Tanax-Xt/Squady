"use client";

import { ClassValue, tv, VariantProps } from "tailwind-variants";

export const cell = tv(
  {
    slots: {
      root: [
        "flex w-full items-center gap-2 px-3 py-2.5",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-5",
        "[&_svg:not([class*='stroke-'])]:stroke-[1.75]",
      ],
      before: "flex",
      content: "grow overflow-hidden text-left",
      label: "",
      detail: "ms-1 text-muted-foreground",
      description: "text-muted-foreground",
      after: "flex",
    },
    variants: {
      size: {
        sm: {
          content: "text-sm",
        },
        md: {
          content: "text-base",
        },
      },
      color: {
        primary: {
          root: "[&_svg:not([class*='text-'])]:text-primary",
          content: "text-primary",
        },
        default: {
          root: "[&_svg:not([class*='text-'])]:text-muted-foreground",
        },
      },
      multiline: {
        false: {
          description: "truncate",
        },
        true: {
          description: "text-pretty whitespace-pre-line",
        },
      },
      hoverable: {
        true: {
          root: [
            "cursor-pointer",
            "transition",
            "hover:bg-accent",
            "active:bg-accent active:duration-0",
            "focus-visible:bg-accent focus-visible:outline-none",
          ],
        },
        false: {
          label: "cursor-default",
          description: "cursor-default",
        },
      },
    },
    defaultVariants: {
      color: "default",
    },
  },
  { twMerge: true },
);

export type CellVariantProps = VariantProps<typeof cell>;

export type CellComponentProps<T extends React.ElementType> = Omit<
  React.ComponentProps<T>,
  "children" | "className"
>;

export type CellBaseProps<T extends React.ElementType> = {
  as?: T;
  before?: React.ReactNode;
  label?: React.ReactNode;
  detail?: React.ReactNode;
  description?: React.ReactNode;
  after?: React.ReactNode;
  className?: ClassValue;
  classNames?: Partial<Record<keyof ReturnType<typeof cell>, ClassValue>>;
};

export type CellProps<T extends React.ElementType> = CellComponentProps<T> &
  CellBaseProps<T> &
  CellVariantProps;

/**
 * @deprecated use `<Item />` instead
 */
const Cell = <T extends React.ElementType = "div">({
  as,
  before,
  label,
  detail,
  description,
  after,
  className,
  classNames,
  size,
  color,
  multiline,
  hoverable,
  ...otherProps
}: CellProps<T>): React.ReactNode => {
  const slots = cell({ size, color, multiline, hoverable, className });

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
        <div className="flex">
          <span className={slots.label({ className: classNames?.label })}>
            {label}
          </span>
          {detail && (
            <span className={slots.detail({ className: classNames?.detail })}>
              {detail}
            </span>
          )}
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
