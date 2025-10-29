"use client";

import { Button } from "@/shared/ui/button";
import Tooltip from "@/shared/ui/tooltip";

export interface IconButtonProps extends React.ComponentProps<typeof Button> {
  side?: "top" | "right" | "bottom" | "left";
}

const IconButton: React.FunctionComponent<IconButtonProps> = ({
  side,
  title,
  ...otherProps
}) => {
  return (
    <Tooltip disableHoverableContent>
      <Tooltip.Trigger asChild>
        <Button
          size="icon"
          variant="outline"
          aria-label={title}
          {...otherProps}
        />
      </Tooltip.Trigger>
      <Tooltip.Content side={side}>{title}</Tooltip.Content>
    </Tooltip>
  );
};

export default IconButton;
