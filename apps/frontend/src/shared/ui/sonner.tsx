"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast, ToasterProps } from "sonner";

import { useIsMobile } from "@/shared/hooks/use-mobile";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const isMobile = useIsMobile();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      toastOptions={{ closeButtonAriaLabel: "Закрыть уведомление" }}
      containerAriaLabel="Уведомления"
      closeButton={!isMobile}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { toast, Toaster };
