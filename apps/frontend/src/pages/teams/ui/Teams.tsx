import { TeamResponse } from "@/shared/api";
import { TeamItem } from "@/widgets/team-item";

import { TeamsEmpty } from "./TeamsEmpty";

function Teams({ teams }: { teams: TeamResponse[] | undefined }) {
  return (
    <section className="space-y-4">
      <h2 id="all" className="scroll-mt-18 text-xl font-semibold">
        Все команды
      </h2>

      <div className="mt-4 flex flex-col gap-4">
        {!!teams?.length ? (
          teams.map((teamMy) => <TeamItem key={teamMy.id} team={teamMy} />)
        ) : (
          <TeamsEmpty />
        )}
      </div>
    </section>
  );
}

export { Teams };
