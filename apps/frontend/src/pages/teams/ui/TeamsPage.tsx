import { getTeams, getTeamsMy } from "@/entities/team";
import Bar from "@/shared/ui/bar";
import Page from "@/shared/ui/page";
import { SidebarTrigger } from "@/shared/ui/sidebar";

import { Teams } from "./Teams";
import { TeamsMy } from "./TeamsMy";

async function TeamsPage() {
  const teams = await getTeams();
  const teamsMy = await getTeamsMy();

  return (
    <Page>
      <Bar>
        <Bar.Start className="md:hidden">
          <SidebarTrigger />
        </Bar.Start>
        <Bar.Center showAfterScrolled>Команды</Bar.Center>
      </Bar>
      <Page.Content size="3xl">
        <h1 className="text-2xl font-semibold">Команды</h1>

        <div className="space-y-8">
          <TeamsMy teamsMy={teamsMy} />
          <Teams teams={teams} />
        </div>
      </Page.Content>
    </Page>
  );
}

export { TeamsPage };
