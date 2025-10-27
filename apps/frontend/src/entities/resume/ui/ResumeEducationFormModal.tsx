"use client";

import { useState } from "react";

import { useIsMobile } from "@/shared/hooks/use-mobile";
import Button from "@/shared/ui/button";
import Dialog from "@/shared/ui/dialog";
import Drawer from "@/shared/ui/drawer";

import ResumeEducationForm from "./ResumeEducationForm";

export interface ResumeEducationFormModalProps
  extends React.ComponentProps<typeof ResumeEducationForm> {
  trigger: React.ReactNode;
}

const ResumeEducationFormModal: React.FunctionComponent<
  ResumeEducationFormModalProps
> = ({ trigger, onSubmit, ...otherProps }) => {
  const [open, setOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const Root = isMobile ? Drawer : Dialog;

  return (
    <Root open={open} onOpenChange={setOpen} autoFocus={isMobile}>
      <Root.Trigger asChild>{trigger}</Root.Trigger>
      <Root.Content>
        <Root.Header>
          <Root.Title>Учебное заведение</Root.Title>
          <Root.Description>
            Укажите информацию о вашем учебном заведении.
          </Root.Description>
        </Root.Header>

        <ResumeEducationForm
          className={isMobile ? "px-4" : undefined}
          onSubmit={(values) => {
            onSubmit?.(values);
            setOpen(false);
          }}
          {...otherProps}
        />

        <Root.Footer className="pt-2">
          <Root.Close asChild>
            <Button
              variant="outline"
              stretched
              className={isMobile ? undefined : "-mt-4"}
            >
              Закрыть
            </Button>
          </Root.Close>
        </Root.Footer>
      </Root.Content>
    </Root>
  );
};

export default ResumeEducationFormModal;
