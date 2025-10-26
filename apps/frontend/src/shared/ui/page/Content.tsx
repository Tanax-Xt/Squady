import { VariantProps } from "class-variance-authority";

import variants from "./Content.variants";

export type PageContentVariantProps = VariantProps<typeof variants>;
export interface PageContentProps
  extends PageContentVariantProps,
    React.ComponentProps<"div"> {}

const PageContent: React.FunctionComponent<PageContentProps> = ({
  size,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={variants({
        size,
        className,
      })}
      {...otherProps}
    />
  );
};

export default PageContent;
