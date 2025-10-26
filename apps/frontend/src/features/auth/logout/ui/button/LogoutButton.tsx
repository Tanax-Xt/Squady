"use client";

import { useTransition } from "react";

import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/button";

import LogoutButtonIdleContent from "./LogoutButtonIdleContent";
import LogoutButtonPendingContent from "./LogoutButtonPendingContent";
import { logout } from "../../api/actions";

export interface LogoutButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "children"> {}

const LogoutButton: React.FunctionComponent<LogoutButtonProps> = ({
  className,
  ...otherProps
}) => {
  const [pending, startTransition] = useTransition();

  const startLogout = () => {
    startTransition(logout);
  };

  return (
    <Button
      size="lg"
      variant="outline"
      loading={pending}
      onClick={startLogout}
      className={cn("text-destructive max-md:mt-auto", className)}
      {...otherProps}
    >
      {pending ? <LogoutButtonPendingContent /> : <LogoutButtonIdleContent />}
    </Button>
  );
};

export default LogoutButton;
