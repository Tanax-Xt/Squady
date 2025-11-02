import { parse } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getEvent } from "@/entities/event";
import { getCurrentUser } from "@/entities/user";
import { EventUpdateForm } from "@/features/event/update";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";

export async function EventEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return notFound();
  }

  const currentUser = await getCurrentUser();

  if (currentUser.id !== event.agent_id || currentUser.role !== "agent") {
    return notFound();
  }

  return (
    <Page>
      <Bar>
        <Bar.Start>
          <Button variant="ghost" asChild>
            <Link href={`/events/${event.id}`}>
              <ArrowLeftIcon />
              Назад
            </Link>
          </Button>
        </Bar.Start>
        <Bar.Center>Изменение события</Bar.Center>
      </Bar>
      <Page.Content size="3xl">
        <EventUpdateForm
          eventId={event.id}
          defaultValues={{
            title: event.title,
            description: event.description,
            dateRange: {
              from: parse(event.start_date, "yyyy-MM-dd", new Date()),
              to: parse(event.end_date, "yyyy-MM-dd", new Date()),
            },
            format: event.format,
            location: event.location,
          }}
        />
      </Page.Content>
    </Page>
  );
}
