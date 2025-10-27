import { useCallback, useRef } from "react";

import AlertDialog from "@/shared/ui/alert-dialog";

type ActionDialogProps = {
  variant?: "default" | "destructive";
  open?: boolean | undefined;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action: React.ReactNode;
  cancel: React.ReactNode;
  onAction?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onActionCloseAutoFocus?: ((event: Event) => void) | undefined;
  onCancel?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onCancelCloseAutoFocus?: ((event: Event) => void) | undefined;
  onCloseAutoFocus?: ((event: Event) => void) | undefined;
};

const ActionDialog: React.FunctionComponent<ActionDialogProps> = ({
  variant,
  open,
  onOpenChange,
  trigger,
  title,
  description,
  action,
  cancel,
  onAction,
  onActionCloseAutoFocus,
  onCancel,
  onCancelCloseAutoFocus,
  onCloseAutoFocus,
}) => {
  const decision = useRef<"action" | "cancel">(null);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      onOpenChange?.(open);

      if (decision.current !== null) return;

      decision.current = "cancel";
    },
    [decision, onOpenChange],
  );

  const handleAction: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      onAction?.(event);

      if (event.defaultPrevented) return;

      decision.current = "action";
    },
    [onAction],
  );

  const handleCloseAutoFocus = useCallback(
    (event: Event) => {
      onCloseAutoFocus?.(event);

      if (event.defaultPrevented) return;
      if (decision.current === "action") onActionCloseAutoFocus?.(event);
      if (decision.current === "cancel") onCancelCloseAutoFocus?.(event);

      decision.current = null;
    },
    [
      decision,
      onActionCloseAutoFocus,
      onCancelCloseAutoFocus,
      onCloseAutoFocus,
    ],
  );

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <AlertDialog.Trigger asChild></AlertDialog.Trigger>}
      <AlertDialog.Content onCloseAutoFocus={handleCloseAutoFocus}>
        <AlertDialog.Header>
          <AlertDialog.Title>{title}</AlertDialog.Title>
          {description && (
            <AlertDialog.Description>{description}</AlertDialog.Description>
          )}
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Action variant={variant} onClick={handleAction}>
            {action}
          </AlertDialog.Action>
          <AlertDialog.Cancel onClick={onCancel}>{cancel}</AlertDialog.Cancel>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default ActionDialog;
