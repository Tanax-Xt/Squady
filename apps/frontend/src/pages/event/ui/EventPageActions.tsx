"use client";

import {
  LinkIcon,
  MoreVerticalIcon,
  PenLineIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteEvent } from "@/features/event/delete";
import { EventResponse } from "@/shared/api";
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

export function EventPageActions({ event }: { event: EventResponse }) {
  const [deleting, startDeleting] = useTransition();

  const updatedAt = useDateTimeFormat({
    value: event.updated_at,
    locales: "ru",
    options: {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    },
  });

  const copyLink = () => {
    if (window.isSecureContext) {
      navigator.clipboard.writeText(
        `${process.env.NODE_ENV === "production" ? "https" : "http"}://${window.location.host}/events/${event.id}`,
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
          <Button size="icon" variant="ghost">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Действия с событием</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={copyLink}>
            <LinkIcon />
            Скопировать ссылку
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/events/${event.id}/edit`}>
              <PenLineIcon />
              Изменить
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              Удалить
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs! text-muted-foreground">
            Обновлено {updatedAt}
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenuRoot>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить событие "{event.title}"?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            variant="destructive"
            disabled={deleting}
            onClick={(e) => {
              e.preventDefault();
              startDeleting(() => deleteEvent(event.id));
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
}
