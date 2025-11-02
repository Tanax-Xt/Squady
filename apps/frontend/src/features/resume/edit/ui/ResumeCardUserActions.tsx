"use client";

import {
  CopyPlusIcon,
  ExternalLinkIcon,
  FolderIcon,
  LinkIcon,
  LockIcon,
  LockOpenIcon,
  MoreVerticalIcon,
  PenLineIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { toast } from "sonner";

import { ResumeResponse } from "@/shared/api";
import useDateTimeFormat from "@/shared/hooks/use-date-time-format";
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
  DropdownMenuLabel,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import Spinner from "@/shared/ui/spinner";

import { deleteResume, toggleResumeIsPublic } from "../api/actions";

export const ResumeCardUserActions: React.FC<
  Pick<React.ComponentProps<typeof Button>, "variant"> & {
    resume: ResumeResponse;
    isCurrentUser?: boolean;
    children?: React.ReactNode;
  }
> = ({ resume, children, isCurrentUser, variant = "ghost" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === `/resumes/${resume.id}`;

  const updatedAt = useDateTimeFormat({
    value: resume.updated_at,
    locales: "ru",
    options: {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    },
  });

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
      navigator.clipboard.writeText(
        `${process.env.NODE_ENV === "production" ? "https" : "http"}://${window.location.host}/resumes/${resume.id}`,
      );
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
          {children ? (
            children
          ) : (
            <Button
              size="icon"
              variant={variant}
              aria-label="Действия с резюме"
            >
              <MoreVerticalIcon />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Действия с резюме</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!isActive && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/resumes/${resume.id}`}>
                  <FolderIcon />
                  Открыть
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/resumes/${resume.id}`} target="_blank">
                  <ExternalLinkIcon />
                  Открыть в новой вкладке
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onSelect={copyLink}>
            <LinkIcon />
            Скопировать ссылку
          </DropdownMenuItem>
          {isCurrentUser && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={edit}>
                <PenLineIcon />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => toggleResumeIsPublic(resume.id)}
              >
                {resume.is_public ? <LockIcon /> : <LockOpenIcon />}
                {resume.is_public ? "Сделать приватным" : "Сделать публичным"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={duplicate}>
                <CopyPlusIcon />
                Дублировать
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon />
                  Удалить
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs! text-muted-foreground">
            Обновлено {updatedAt}
          </DropdownMenuLabel>
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
            onClick={(e) => {
              e.preventDefault();
              startTransition(startDeleteResume);
            }}
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
