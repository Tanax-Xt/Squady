"use client";

import { UnplugIcon } from "lucide-react";
import { useTransition } from "react";

import { kickMemberFromTeam } from "@/features/team/kick-member";
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

export function TeamLeaveButton({
  team,
  userId,
}: {
  team: TeamResponse;
  userId: string;
}) {
  const [leaving, startLeaving] = useTransition();

  const handleActionClick = () => {
    startLeaving(async () => {
      await kickMemberFromTeam(team.id, userId);
    });
  };

  return (
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="!text-destructive"
          disabled={leaving}
        >
          {leaving ? (
            <>
              <Spinner />
              Покидание команды...
            </>
          ) : (
            <>
              <UnplugIcon />
              Покинуть команду
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Покинуть команду «{team.title}»?</AlertDialogTitle>
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
