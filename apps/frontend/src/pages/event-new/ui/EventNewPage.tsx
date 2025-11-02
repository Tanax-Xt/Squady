import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/entities/user";
import { EventCreateForm } from "@/features/event/create";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";

export async function EventNewPage() {
  const currentUser = await getCurrentUser();

  if (currentUser.role !== "agent") {
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
        <Bar.Center>Новое событие</Bar.Center>
      </Bar>
      <Page.Content size="3xl">
        <EventCreateForm />
      </Page.Content>
    </Page>
  );
}
