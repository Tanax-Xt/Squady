"use client";

import {
  CopyPlusIcon,
  LockIcon,
  LockOpenIcon,
  MoreVerticalIcon,
  PenLineIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";

import { ResumeResponse } from "@/shared/api";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import Button from "@/shared/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import Spinner from "@/shared/ui/spinner";

import { deleteResume, toggleResumeIsPublic } from "../api/actions";

export const ResumeCardUserActions: React.FC<
  Pick<React.ComponentProps<typeof Button>, "variant"> & {
    resume: ResumeResponse;
  }
> = ({ resume, variant = "outline" }) => {
  const router = useRouter();

  const [, startDeleteResume, deleting] = useActionState(
    deleteResume.bind(null, resume.id),
    undefined,
  );

  const edit = () => {
    router.push(
      `/resume/${resume.id}/edit?back=${encodeURIComponent("/resume")}`,
    );
  };

  const duplicate = () => {
    router.push(
      `/resume/${resume.id}/duplicate?back=${encodeURIComponent("/resume")}`,
    );
  };

  return (
    <AlertDialogRoot>
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant={variant}
            className="rounded-full"
            aria-label="Действия с резюме"
          >
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={edit}>
            <PenLineIcon />
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={duplicate}>
            <CopyPlusIcon />
            Дублировать
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => toggleResumeIsPublic(resume.id)}>
            {resume.is_public ? <LockIcon /> : <LockOpenIcon />}
            {resume.is_public ? "Сделать приватным" : "Сделать публичным"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              Удалить
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenuRoot>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить резюме "{resume.role}"?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            variant="destructive"
            loading={deleting}
            onClick={() => startTransition(startDeleteResume)}
          >
            {deleting && <Spinner />}
            Да
          </AlertDialogAction>
          <AlertDialogCancel disabled={deleting}>Нет</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};
