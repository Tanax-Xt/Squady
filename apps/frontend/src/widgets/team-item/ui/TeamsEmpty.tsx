"use client";

import { PlusIcon, UserXIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";

function TeamsEmpty() {
  return (
    <Empty className="border border-dashed">
      <EmptyMedia variant="icon">
        <UserXIcon />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>На платформе ещё нет ни одной команды</EmptyTitle>
        <EmptyDescription>
          Будьте первым, кто создаст команду на нашей платформе!
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="default" asChild>
          <Link href="/teams/new">
            <PlusIcon />
            Создать команду
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export { TeamsEmpty };
