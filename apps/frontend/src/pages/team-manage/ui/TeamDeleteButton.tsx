"use client";

import { UnplugIcon } from "lucide-react";
import { useTransition } from "react";

import { TeamResponse } from "@/shared/api";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import Spinner from "@/shared/ui/spinner";

import { deleteTeam } from "../api/actions";

export function TeamDeleteButton({ team }: { team: TeamResponse }) {
  const [deleting, startDeleting] = useTransition();

  const handleActionClick = () => {
    startDeleting(async () => {
      await deleteTeam(team.id);
    });
  };

  return (
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="!text-destructive"
          disabled={deleting}
        >
          {deleting ? (
            <>
              <Spinner />
              Распущение команды...
            </>
          ) : (
            <>
              <UnplugIcon />
              Распустить
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Распустить команду «{team.title}»?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction variant="destructive" onClick={handleActionClick}>
            Да
          </AlertDialogAction>
          <AlertDialogCancel>Нет</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
