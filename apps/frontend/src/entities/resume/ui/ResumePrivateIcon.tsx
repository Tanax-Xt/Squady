"use client";

import { LockIcon } from "lucide-react";

import Tooltip from "@/shared/ui/tooltip";

export const ResumePrivateIcon = () => {
  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <div className="flex items-center justify-center rounded-full bg-muted p-1 text-muted-foreground">
          <LockIcon className="size-2.5" strokeWidth={2.5} />
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>Это резюме видно только вам</Tooltip.Content>
    </Tooltip>
  );
};
