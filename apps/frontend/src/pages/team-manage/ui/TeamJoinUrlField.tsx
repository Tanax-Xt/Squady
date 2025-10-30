"use client";

import { toast } from "sonner";

import { Field, FieldDescription, FieldLabel } from "@/shared/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/ui/input-group";

export function TeamJoinUrlField({ joinUrl }: { joinUrl: string }) {
  const copyUrl: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (window.isSecureContext) {
      navigator.clipboard.writeText(joinUrl);
      toast.success("Ссылка скопирована!");
    } else {
      toast.error("Не удалось скопировать ссылку!", {
        description: "Окно браузера используется в небезопасном контексте.",
      });
    }
  };

  return (
    <Field>
      <FieldLabel htmlFor="team-invitations-card-join-url">
        Ссылка для подачи заявки
      </FieldLabel>
      <Field orientation="horizontal">
        <InputGroup>
          <InputGroupInput
            id="team-invitations-card-join-url"
            value={joinUrl}
            readOnly
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={copyUrl}>Скопировать</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <FieldDescription>
        Скопируйте ссылку и поделитесь с будущими участниками команды.
      </FieldDescription>
    </Field>
  );
}
