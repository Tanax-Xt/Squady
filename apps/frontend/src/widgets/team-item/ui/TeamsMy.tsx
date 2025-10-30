"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { TeamResponse } from "@/shared/api";
import { Button } from "@/shared/ui/button";

import { TeamItem } from "./TeamItem";
import { TeamsMyEmpty } from "./TeamsMyEmpty";

function TeamsMy({ teamsMy }: { teamsMy: TeamResponse[] | undefined }) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 id="my" className="text-xl font-semibold">
          Мои команды
        </h2>
        <Button size="sm" className="rounded-full" variant="outline" asChild>
          <Link href="/teams/new">
            <PlusIcon />
            Создать
          </Link>
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {!!teamsMy?.length ? (
          teamsMy.map((teamMy) => <TeamItem key={teamMy.id} team={teamMy} />)
        ) : (
          <TeamsMyEmpty />
        )}
      </div>
    </section>
  );
}

export { TeamsMy };
