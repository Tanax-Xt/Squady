"use client";
import { PlusIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { TeamResponse } from "@/shared/api";
import Sidebar, { SidebarGroupAction } from "@/shared/ui/sidebar";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

export function NavTeams({ teams }: { teams: TeamResponse[] | undefined }) {
  const pathname = usePathname();

  return (
    <Sidebar.Group>
      <Sidebar.GroupLabel>Мои команды</Sidebar.GroupLabel>
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
      <Sidebar.Menu>
        {teams?.map((team) => {
          const href = `/teams/${team.id}`;

          return (
            <Sidebar.MenuItem key={team.id}>
              <Sidebar.MenuButton
                asChild
                tooltip={team.title}
                isActive={pathname === href}
              >
                <Link href={href}>
                  <UsersIcon />
                  <span>{team.title}</span>
                </Link>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          );
        })}
      </Sidebar.Menu>
    </Sidebar.Group>
  );
}
