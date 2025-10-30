import { CardContent, CardHeader, CardRoot, CardTitle } from "@/shared/ui/card";
import { FieldGroup } from "@/shared/ui/field";

import { TeamInviteField } from "./TeamInviteField";
import { TeamJoinUrlField } from "./TeamJoinUrlField";

export async function TeamInvitationsCard({
  joinUrl,
  teamId,
}: {
  joinUrl: string;
  teamId: string;
}) {
  return (
    <CardRoot>
      <CardHeader>
        <CardTitle>Приглашения</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <TeamJoinUrlField joinUrl={joinUrl} />
          <TeamInviteField teamId={teamId} />
        </FieldGroup>
      </CardContent>
    </CardRoot>
  );
}
