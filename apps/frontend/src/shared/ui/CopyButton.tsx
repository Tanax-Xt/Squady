"use client";

import { CopyIcon } from "lucide-react";

import IconButton from "@/shared/ui/IconButton";
import { toast } from "@/shared/ui/sonner";

interface CopyButtonProps
  extends Omit<React.ComponentProps<typeof IconButton>, "children"> {
  value: string;
  messages?: {
    copy: string;
    success: string;
    error: string;
  };
}

const CopyButton: React.FunctionComponent<CopyButtonProps> = ({
  value,
  messages = {
    copy: "Скопировать",
    success: "Скопировано!",
    error: "Не удалось скопировать",
  },
  onClick,
  ...otherProps
}) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);

    if (window.isSecureContext) {
      navigator.clipboard.writeText(value);
      toast.success(messages.success);
    } else {
      toast.error(messages.error, {
        description: "Окно браузера используется в небезопасном контексте.",
      });
    }
  };

  return (
    <IconButton title={messages.copy} onClick={handleClick} {...otherProps}>
      <CopyIcon />
    </IconButton>
  );
};

export default CopyButton;
