"use client";

import {
  CopyPlusIcon,
  LinkIcon,
  LockIcon,
  LockOpenIcon,
  MoreVerticalIcon,
  PenLineIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { toast } from "sonner";

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
import { Button } from "@/shared/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import Spinner from "@/shared/ui/spinner";

import { deleteResume, toggleResumeIsPublic } from "../api/actions";

// TODO: show edit/delete actions only if current user id === owner id
export const ResumeCardUserActions: React.FC<
  Pick<React.ComponentProps<typeof Button>, "variant"> & {
    resume: ResumeResponse;
  }
> = ({ resume, variant = "ghost" }) => {
  const router = useRouter();

  const [, startDeleteResume, deleting] = useActionState(
    deleteResume.bind(null, resume.id),
    undefined,
  );

  const edit = () => {
    router.push(
      `/resumes/${resume.id}/edit?back=${encodeURIComponent("/resumes")}`,
    );
  };

  const duplicate = () => {
    router.push(
      `/resumes/${resume.id}/duplicate?back=${encodeURIComponent("/resumes")}`,
    );
  };

  const copyLink = () => {
    if (window.isSecureContext) {
      navigator.clipboard.writeText(`/resumes/${resume.id}`);
      toast.success("Ссылка на резюме скопирована!");
    } else {
      toast.error("Не удалось скопировать ссылку на резюме!", {
        description: "Окно браузера используется в небезопасном контексте.",
      });
    }
  };

  return (
    <AlertDialogRoot>
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant={variant} aria-label="Действия с резюме">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={copyLink}>
            <LinkIcon />
            Скопировать ссылку
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
            disabled={deleting}
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
