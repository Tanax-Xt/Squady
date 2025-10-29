"use client";

import { Trash2Icon } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/shared/ui/button";
import Spinner from "@/shared/ui/spinner";

import { deleteTeam } from "../api/actions";

export function TeamDeleteButton({ teamId }: { teamId: string }) {
  const [loading, startLoading] = useTransition();
  return (
    <Button
      variant="destructive"
      onClick={() =>
        startLoading(async () => {
          await deleteTeam(teamId);
        })
      }
    >
      {loading ? (
        <>
          <Spinner />
          Удаление команды...
        </>
      ) : (
        <>
          <Trash2Icon />
          Распустить
        </>
      )}
    </Button>
  );
}
