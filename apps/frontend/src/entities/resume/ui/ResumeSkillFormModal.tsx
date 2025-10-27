"use client";

import { useState } from "react";

import { useIsMobile } from "@/shared/hooks/use-mobile";
import Dialog from "@/shared/ui/dialog";
import Drawer from "@/shared/ui/drawer";

import ResumeSkillForm from "./ResumeSkillForm";

export interface ResumeSkillFormModalProps
  extends React.ComponentProps<typeof ResumeSkillForm> {
  trigger: React.ReactNode;
}

const ResumeSkillFormModal: React.FunctionComponent<
  ResumeSkillFormModalProps
> = ({ trigger, onSubmit, ...otherProps }) => {
  const [open, setOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const Root = isMobile ? Drawer : Dialog;

  return (
    <Root open={open} onOpenChange={setOpen} autoFocus={isMobile}>
      <Root.Trigger asChild>{trigger}</Root.Trigger>
      <Root.Content showCloseButton>
        <Root.Header>
          <Root.Title>Добавление навыка</Root.Title>
          <Root.Description>
            Укажите, каким навыком вы владеете.
          </Root.Description>
        </Root.Header>

        <ResumeSkillForm
          className={isMobile ? "px-4 pb-4" : undefined}
          onSubmit={(values) => {
            onSubmit?.(values);
            setOpen(false);
          }}
          {...otherProps}
        />
      </Root.Content>
    </Root>
  );
};

export default ResumeSkillFormModal;
