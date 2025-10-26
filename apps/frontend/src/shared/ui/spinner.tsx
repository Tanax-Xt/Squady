import { LoaderIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface SpinnerProps
  extends Omit<React.ComponentProps<typeof LoaderIcon>, "children"> {}

const Spinner: React.FunctionComponent<SpinnerProps> = ({
  className,
  ...otherProps
}) => {
  return (
    <LoaderIcon className={cn("animate-spin", className)} {...otherProps} />
  );
};

export default Spinner;
