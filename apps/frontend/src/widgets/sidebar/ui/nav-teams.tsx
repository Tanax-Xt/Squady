"use client";

import {
  CrownIcon,
  ExternalLinkIcon,
  FolderIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PlusIcon,
  Settings2Icon,
  UnplugIcon,
  UserPlusIcon,
  UserSearchIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { kickMemberFromTeam } from "@/features/team/kick-member";
import { deleteTeam } from "@/features/team/manage";
import { CurrentUserResponse, TeamResponse } from "@/shared/api";
import useDateTimeFormat from "@/shared/hooks/use-date-time-format";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";
import Spinner from "@/shared/ui/spinner";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

function TeamSidebarMenuItem({
  user,
  team,
  isLeader,
  isActive,
}: {
  user: CurrentUserResponse;
  team: TeamResponse;
  isLeader?: boolean;
  isActive?: boolean;
}) {
  const copyTeamLink = () => {
    if (window.isSecureContext) {
      navigator.clipboard.writeText(
        `${process.env.NODE_ENV === "production" ? "https" : "http"}://${window.location.host}/teams/${team.id}`,
      );
      toast.success("Ссылка на команду скопирована!");
    } else {
      toast.error("Не удалось скопировать ссылку на команду!", {
        description: "Окно браузера используется в небезопасном контексте.",
      });
    }
  };

  const copyTeamJoinLink = () => {
    if (window.isSecureContext) {
      navigator.clipboard.writeText(
        `${process.env.NODE_ENV === "production" ? "https" : "http"}://${window.location.host}/teams/${team.id}/join`,
      );
      toast.success("Ссылка на вступление в команду скопирована!");
    } else {
      toast.error("Не удалось скопировать ссылку на вступление  на команду!", {
        description: "Окно браузера используется в небезопасном контексте.",
      });
    }
  };

  const href = `/teams/${team.id}`;

  const updatedAt = useDateTimeFormat({
    value: team.updated_at,
    locales: "ru",
    options: {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    },
  });

  const [deletingShow, setDeletingShow] = useState(false);
  const [deleting, startDeleting] = useTransition();

  const startDeletingTeam = () => {
    startDeleting(async () => {
      await deleteTeam(team.id);
    });
  };

  const [leavingShow, setLeavingShow] = useState(false);
  const [leaving, startLeaving] = useTransition();

  const startLeavingTeam = () => {
    startLeaving(async () => {
      await kickMemberFromTeam(team.id, user.id);
    });
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} asChild>
        <Link href={href}>
          <UsersIcon />
          <span className="flex items-center justify-between gap-1">
            <span className="truncate">{team.title}</span>
            {isLeader && (
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <CrownIcon
                    className="size-3.5 text-yellow-600"
                    fill="currentColor"
                  />
                </TooltipTrigger>
                <TooltipContent>Вы лидер этой команды</TooltipContent>
              </TooltipRoot>
            )}
          </span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontalIcon />
            <span className="sr-only">Действия с командой</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Действия с командой</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!isActive && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/teams/${team.id}`}>
                  <FolderIcon />
                  Открыть
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/teams/${team.id}`} target="_blank">
                  <ExternalLinkIcon />
                  Открыть в новой вкладке
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onSelect={copyTeamLink}>
            <LinkIcon />
            Скопировать ссылку
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={copyTeamJoinLink}>
            <UserPlusIcon />
            Скопировать ссылку на вступление
          </DropdownMenuItem>
          {isLeader ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`${href}/manage`}>
                  <Settings2Icon />
                  Управление
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={deleting}
                onSelect={() => setDeletingShow(true)}
              >
                <UnplugIcon />
                Распустить
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={leaving}
                onSelect={() => setLeavingShow(true)}
              >
                <UnplugIcon />
                Покинуть
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs! text-muted-foreground">
            Обновлена {updatedAt}
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenuRoot>

      <AlertDialogRoot open={deletingShow} onOpenChange={setDeletingShow}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Распустить команду «{team.title}»?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                startDeletingTeam();
              }}
              disabled={deleting}
            >
              {deleting && <Spinner />}
              Да
            </AlertDialogAction>
            <AlertDialogCancel disabled={deleting}>Нет</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>

      <AlertDialogRoot open={leavingShow} onOpenChange={setLeavingShow}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Покинуть команду «{team.title}»?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                startLeavingTeam();
              }}
              disabled={leaving}
            >
              {leaving && <Spinner />}
              Да
            </AlertDialogAction>
            <AlertDialogCancel disabled={leaving}>Нет</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    </SidebarMenuItem>
  );
}

export function NavTeams({
  user,
  teams,
}: {
  user: CurrentUserResponse;
  teams: TeamResponse[] | undefined;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Мои команды</SidebarGroupLabel>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <SidebarGroupAction asChild>
            <Link href="/teams/new">
              <PlusIcon />
            </Link>
          </SidebarGroupAction>
        </TooltipTrigger>
        <TooltipContent>Новая команда</TooltipContent>
      </TooltipRoot>
      <SidebarGroupContent>
        <SidebarMenu>
          {teams
            ?.sort((a, b) => {
              return (
                Date.parse(b.updated_at).valueOf() -
                Date.parse(a.updated_at).valueOf()
              );
            })
            .map((team) => {
              const href = `/teams/${team.id}`;
              const isLeader = user.id === team.leader_id;
              const isActive = href === pathname;

              return (
                <TeamSidebarMenuItem
                  key={team.id}
                  user={user}
                  team={team}
                  isLeader={isLeader}
                  isActive={isActive}
                />
              );
            })}
          <SidebarMenuButton className="text-accent-foreground/75" asChild>
            <Link href="/teams#all">
              <UserSearchIcon />
              <span>Поиск команд</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
