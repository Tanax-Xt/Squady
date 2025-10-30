"use client";

import { CheckIcon, LinkIcon, UsersIcon, XIcon } from "lucide-react";
import { Fragment, useTransition } from "react";
import { toast } from "sonner";

import { ApplicationResponse, TeamResponse } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { ButtonGroup } from "@/shared/ui/button-group";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/shared/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";
import { ItemContent, ItemGroup, ItemSeparator } from "@/shared/ui/item";
import { TeamMemberItem } from "@/widgets/team-item";

import { updateTeamApplication } from "../api/actions";

export function TeamInCheckMembersCard({
  team,
  applications,
  joinUrl,
}: {
  team: TeamResponse;
  applications: ApplicationResponse[] | undefined;
  joinUrl: string;
}) {
  const copyUrl: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (window.isSecureContext) {
      navigator.clipboard.writeText(joinUrl);
      toast.success("Ссылка скопирована!");
    } else {
      toast.error("Не удалось скопировать ссылку!", {
        description: "Окно браузера используется в небезопасном контексте.",
      });
    }
  };

  const pendingApplications = (applications ?? []).filter(
    (application) => application.status === "sent",
  );

  const [resolving, setResolving] = useTransition();

  return (
    <CardRoot>
      <CardHeader>
        <CardTitle>
          Заявки{" "}
          {!!pendingApplications.length && (
            <span className="text-muted-foreground">
              ({pendingApplications.length})
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Принимайте или отклоняйте заявки на вступление в ряды вашей команды.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!!pendingApplications.length ? (
          <ItemGroup>
            {pendingApplications.map((pendingApplication, index) => (
              <Fragment key={pendingApplication.id}>
                <TeamMemberItem
                  id={`application-${pendingApplication.id}`}
                  team={team}
                  member={pendingApplication.user}
                  resume={pendingApplication.resume}
                  back={`/teams/${team.id}/manage#application-${pendingApplication.id}`}
                  className="scroll-mt-20 px-0"
                  actions={
                    <ButtonGroup>
                      <Button
                        size="sm"
                        onClick={() =>
                          setResolving(async () => {
                            await updateTeamApplication(
                              team.id,
                              pendingApplication.id,
                              {
                                status: "accepted",
                              },
                            );
                          })
                        }
                        disabled={resolving}
                        variant="outline"
                        className="rounded-s-full !text-success"
                      >
                        <CheckIcon />
                        <span className="max-lg:sr-only">Принять</span>
                      </Button>

                      <Button
                        size="sm"
                        onClick={() =>
                          setResolving(async () => {
                            await updateTeamApplication(
                              team.id,
                              pendingApplication.id,
                              {
                                status: "rejected",
                              },
                            );
                          })
                        }
                        disabled={resolving}
                        variant="outline"
                        className="rounded-e-full !text-destructive"
                      >
                        <XIcon />
                        <span className="max-lg:sr-only">Отклонить</span>
                      </Button>
                    </ButtonGroup>
                  }
                />
                {index !== pendingApplications.length - 1 && <ItemSeparator />}
              </Fragment>
            ))}
          </ItemGroup>
        ) : (
          <Empty className="border border-dashed">
            <EmptyMedia variant="icon">
              <UsersIcon />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Нет заявок на вступление</EmptyTitle>
              <EmptyDescription>
                Скопируйте ссылку и поделитесь с будущими участниками команды.
              </EmptyDescription>
            </EmptyHeader>
            <ItemContent>
              <Button size="sm" variant="outline" onClick={copyUrl}>
                <LinkIcon />
                Скопировать ссылку
              </Button>
            </ItemContent>
          </Empty>
        )}
      </CardContent>
    </CardRoot>
  );
}
