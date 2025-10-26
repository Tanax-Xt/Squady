import { cn } from "@/shared/lib/utils";

export interface PageRootProps extends React.ComponentProps<"div"> {}

const PageRoot: React.FunctionComponent<PageRootProps> = ({
  className,
  ...otherProps
}) => {
  return (
    <div
      className={cn("relative flex grow flex-col items-center", className)}
      {...otherProps}
    />
  );
};

export default PageRoot;
