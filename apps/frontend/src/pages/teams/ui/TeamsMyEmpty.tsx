"use client";

import { PlusIcon, SearchIcon, UserXIcon } from "lucide-react";
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

function TeamsMyEmpty({ findTeamHref }: { findTeamHref: string }) {
  return (
    <Empty className="border border-dashed">
      <EmptyMedia variant="icon">
        <UserXIcon />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Вы не состоите ни в одной команде</EmptyTitle>
        <EmptyDescription>
          Присоединитесь к одной из существующих команд или создайте
          собственную.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button size="sm" variant="default" asChild>
            <Link href={findTeamHref}>
              <SearchIcon />
              Найти команду
            </Link>
          </Button>
          <Button size="sm" variant="secondary" asChild>
            <Link href="/teams/new">
              <PlusIcon />
              Создать команду
            </Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}

export { TeamsMyEmpty };
