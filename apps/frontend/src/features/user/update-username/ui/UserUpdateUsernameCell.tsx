"use client";

import { EditIcon } from "lucide-react";
import { useState } from "react";

import { UserUsernameCell } from "@/entities/user";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import IconButton from "@/shared/ui/IconButton";
import { Button } from "@/shared/ui/button";
import Dialog from "@/shared/ui/dialog";
import Drawer from "@/shared/ui/drawer";

import UserUpdateUsernameForm from "./UserUpdateUsernameForm";

interface UserUpdateUsernameCellProps
  extends React.ComponentProps<typeof UserUsernameCell> {}

const UserUpdateUsernameCell: React.FunctionComponent<
  UserUpdateUsernameCellProps
> = ({ value: username, ...otherProps }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const Root = isMobile ? Drawer : Dialog;

  return (
    <UserUsernameCell
      value={username}
      after={
        <Root open={open} onOpenChange={setOpen} autoFocus={isMobile}>
          <IconButton
            asChild
            side="left"
            title="Редактировать имя пользователя"
          >
            <Root.Trigger>
              <EditIcon />
            </Root.Trigger>
          </IconButton>

          <Root.Content>
            <Root.Header>
              <Root.Title>Редактирование имени пользователя</Root.Title>
              <Root.Description>
                Вы можете установить публичное имя пользователя.
              </Root.Description>
            </Root.Header>
            <UserUpdateUsernameForm
              defaultValues={{ username }}
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
      {...otherProps}
    />
  );
};

export default UserUpdateUsernameCell;
