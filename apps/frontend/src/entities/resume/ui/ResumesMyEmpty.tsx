"use client";

import { FileUserIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/ui/button";
import {
  Empty,
  EmptyMedia,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/shared/ui/empty";

function ResumesMyEmpty() {
  return (
    <Empty className="border border-dashed">
      <EmptyMedia variant="icon">
        <FileUserIcon />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>У вас нет резюме</EmptyTitle>
        <EmptyDescription>
          Создайте хотя бы одно резюме, чтобы присоединиться к команде.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" asChild>
          <Link href="/resumes/create">
            <PlusIcon />
            Создать первое резюме
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export { ResumesMyEmpty };
