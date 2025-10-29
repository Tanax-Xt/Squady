"use client";

import { FileUserIcon, LockOpenIcon } from "lucide-react";
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

function ResumesMyPublicEmpty() {
  return (
    <Empty className="border border-dashed">
      <EmptyMedia variant="icon">
        <FileUserIcon />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>У вас нет публичных резюме</EmptyTitle>
        <EmptyDescription>
          Создайте хотя бы одно публичное резюме, чтобы присоединиться к команде
          или создать собственную.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" asChild>
          <Link href="/resumes">
            <LockOpenIcon />
            Посмотреть свои резюме
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export { ResumesMyPublicEmpty };
