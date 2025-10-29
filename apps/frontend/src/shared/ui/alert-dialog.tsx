"use client";

import {
  Action,
  Cancel,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from "@radix-ui/react-alert-dialog";
import { tv } from "tailwind-variants";

import { Button } from "@/shared/ui/button";

export const AlertDialogRoot = Root;

export const AlertDialogTrigger = Trigger;

export const AlertDialogPortal = Portal;

export const alertDialogOverlay = tv(
  {
    base: [
      "fixed inset-0 z-50 bg-black/50",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0",
    ],
  },
  { twMerge: true },
);

export const AlertDialogOverlay = ({
  className,
  ...props
}: React.ComponentProps<typeof Overlay>) => {
  return <Overlay className={alertDialogOverlay({ className })} {...props} />;
};

export const alertDialogContent = tv(
  {
    base: [
      "grid gap-4 p-6",
      "rounded-lg border bg-popover text-popover-foreground shadow-lg",
      "w-full max-w-[calc(100%-2rem)] sm:max-w-sm",
      "fixed top-[50%] left-[50%] z-50",
      "translate-x-[-50%] translate-y-[-50%]",
      "duration-200",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
    ],
  },
  { twMerge: true },
);

export const AlertDialogContent = ({
  className,
  ...props
}: React.ComponentProps<typeof Content>) => {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <Content className={alertDialogContent({ className })} {...props} />
    </AlertDialogPortal>
  );
};

export const alertDialogHeader = tv(
  { base: "flex flex-col gap-2 text-center" },
  { twMerge: true },
);

export const AlertDialogHeader = ({
  className,
  ...props
}: React.ComponentProps<"header">) => {
  return <header className={alertDialogHeader({ className })} {...props} />;
};

export const alertDialogFooter = tv(
  { base: "flex gap-3 [&>*]:flex-1" },
  { twMerge: true },
);

export const AlertDialogFooter = ({
  className,
  ...props
}: React.ComponentProps<"footer">) => {
  return <footer className={alertDialogFooter({ className })} {...props} />;
};

export const alertDialogTitle = tv(
  { base: "text-lg font-semibold" },
  { twMerge: true },
);

export const AlertDialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof Title>) => {
  return <Title className={alertDialogTitle({ className })} {...props} />;
};

export const alertDialogDescription = tv(
  { base: "text-sm text-muted-foreground" },
  { twMerge: true },
);

export const AlertDialogDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof Description>) => {
  return (
    <Description className={alertDialogDescription({ className })} {...props} />
  );
};

export const AlertDialogAction = (
  props: React.ComponentProps<typeof Button>,
) => {
  return (
    <Action asChild>
      <Button {...props} />
    </Action>
  );
};

export const AlertDialogCancel = (
  props: React.ComponentProps<typeof Button>,
) => {
  return (
    <Cancel asChild>
      <Button variant="outline" {...props} />
    </Cancel>
  );
};

const AlertDialog = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Portal: AlertDialogPortal,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
});

export default AlertDialog;
