"use client";

import { EditIcon } from "lucide-react";
import { useState } from "react";

import { UserPasswordCell } from "@/entities/user";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import IconButton from "@/shared/ui/IconButton";
import { Button } from "@/shared/ui/button";
import Dialog from "@/shared/ui/dialog";
import Drawer from "@/shared/ui/drawer";

import UserUpdatePasswordForm from "./UserUpdatePasswordForm";

interface UserUpdatePasswordCellProps
  extends React.ComponentProps<typeof UserPasswordCell> {}

const UserUpdatePasswordCell: React.FunctionComponent<
  UserUpdatePasswordCellProps
> = (props) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const Root = isMobile ? Drawer : Dialog;

  return (
    <UserPasswordCell
      after={
        <Root open={open} onOpenChange={setOpen} autoFocus={isMobile}>
          <IconButton asChild side="left" title="Редактировать пароль">
            <Root.Trigger>
              <EditIcon />
            </Root.Trigger>
          </IconButton>

          <Root.Content>
            <Root.Header>
              <Root.Title>Редактирование пароля</Root.Title>
              <Root.Description>
                Вы можете изменить пароль для своей учётной записи. Это действие
                не сбросит сеансы на других устройствах.
              </Root.Description>
            </Root.Header>
            <UserUpdatePasswordForm
              onSuccess={() => setOpen(false)}
              className={isMobile ? "px-4" : undefined}
            />
            <Root.Footer className="pt-2">
              <Root.Close asChild>
                <Button
                  variant="outline"
                  className={cn(isMobile ? undefined : "-mt-4", "w-full")}
                >
                  Закрыть
                </Button>
              </Root.Close>
            </Root.Footer>
          </Root.Content>
        </Root>
      }
      {...props}
    />
  );
};

export default UserUpdatePasswordCell;
