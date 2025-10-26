import { ClassNameValue } from "tailwind-merge";
import { tv, VariantProps } from "tailwind-variants";

export const placeholder = tv({
  slots: {
    root: "flex grow flex-col items-center justify-center gap-4",
    before: [
      "text-muted-foreground",
      "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-24",
    ],
    content: "space-y-1.5 text-center",
    title: "text-2xl font-semibold",
    description: "text-lg text-muted-foreground",
  },
});

export type PlaceholderVariantProps = VariantProps<typeof placeholder>;

export interface PlaceholderProps extends React.ComponentProps<"div"> {
  before?: React.ReactNode;
  title?: string;
  description?: string;
  after?: React.ReactNode;
  classNames?: Partial<
    Record<keyof ReturnType<typeof placeholder>, ClassNameValue>
  >;
}

const Placeholder: React.FunctionComponent<PlaceholderProps> = ({
  before,
  title,
  description,
  after,
  className,
  classNames,
  ...otherProps
}) => {
  const slots = placeholder({ className });

  return (
    <div
      className={slots.root({ className: classNames?.root })}
      {...otherProps}
    >
      {before && (
        <div className={slots.before({ className: classNames?.before })}>
          {before}
        </div>
      )}

      <hgroup className={slots.content({ className: classNames?.content })}>
        {title && (
          <h1 className={slots.title({ className: classNames?.title })}>
            {title}
          </h1>
        )}
        {description && (
          <p
            className={slots.description({
              className: classNames?.description,
            })}
          >
            {description}
          </p>
        )}
      </hgroup>

      {after}
    </div>
  );
};

export default Placeholder;
