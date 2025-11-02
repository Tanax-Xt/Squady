import Link from "next/link";

import { getCurrentUser } from "@/entities/user";
import Bar from "@/shared/ui/bar";
import { Button } from "@/shared/ui/button";
import Page from "@/shared/ui/page";
import { SidebarTrigger } from "@/shared/ui/sidebar";

import { EventsPageContent } from "./EventsPageContent";

export async function EventsPage() {
  const currentUser = await getCurrentUser();

  return (
    <Page>
      <Bar>
        <Bar.Start className="md:hidden">
          <SidebarTrigger />
        </Bar.Start>

        <Bar.Center showAfterScrolled>События</Bar.Center>

        {currentUser.role === "agent" && (
          <Bar.End>
            <Button variant="ghost" asChild>
              <Link href="/events/new">Создать</Link>
            </Button>
          </Bar.End>
        )}
      </Bar>

      <Page.Content size="3xl">
        <EventsPageContent />
      </Page.Content>
    </Page>
  );
}
