import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getEvent } from "@/entities/event";
import { getCurrentUser } from "@/entities/user";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";

import { EventPageActions } from "./EventPageActions";
import { EventPageContent } from "./EventPageContent";

export async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  const currentUser = await getCurrentUser();

  if (!event) {
    return notFound();
  }

  return (
    <Page>
      <Bar>
        <Bar.Start>
          <Button variant="ghost" asChild>
            <Link href="/events">
              <ArrowLeftIcon />
              Назад
            </Link>
          </Button>
        </Bar.Start>
        <Bar.Center>Событие</Bar.Center>
        {currentUser.id === event.agent_id && (
          <Bar.End>
            <EventPageActions event={event} />
          </Bar.End>
        )}
      </Bar>
      <Page.Content size="3xl">
        <EventPageContent event={event} />
      </Page.Content>
    </Page>
  );
}
