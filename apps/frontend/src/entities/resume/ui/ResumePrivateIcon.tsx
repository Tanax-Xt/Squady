"use client";

import { LockIcon } from "lucide-react";

import Tooltip from "@/shared/ui/tooltip";

export const ResumePrivateIcon = () => {
  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <div className="flex items-center justify-center rounded-full bg-accent/75 p-1 text-accent-foreground/75">
          <LockIcon className="size-2.5" strokeWidth={2.5} />
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>Это резюме видно только вам</Tooltip.Content>
    </Tooltip>
  );
};
