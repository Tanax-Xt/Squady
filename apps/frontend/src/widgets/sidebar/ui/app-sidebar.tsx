"use client";

import {
  FileUserIcon,
  LayoutDashboardIcon,
  LucideIcon,
  UsersIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { CurrentUserResponse, TeamResponse, UserRole } from "@/shared/api";
import ThemeRadioGroup from "@/shared/ui/ThemeRadioGroup";
import Sidebar from "@/shared/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavTeams } from "./nav-teams";
import { NavUser } from "./nav-user";

export function AppSidebar({
  user,
  teamsMy,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: CurrentUserResponse;
  teamsMy: TeamResponse[] | undefined;
}) {
  const pathname = usePathname();
  const sidebar = Sidebar.useContext();

  useEffect(() => {
    if (sidebar.open && sidebar.isMobile) {
      sidebar.setOpenMobile(false);
    }
  }, [pathname]);

  const data: {
    navMain: {
      title: string;
      badge?: string | undefined | number;
      href: string;
      icon: LucideIcon;
      roles?: UserRole[];
    }[];
    projects: { name: string; href: string; type: "olymp" | "hack" }[];
  } = {
    navMain: [
      {
        title: "Сводка",
        href: "/home",
        icon: LayoutDashboardIcon,
      },
      // {
      //   title: "Соревнования",
      //   href: "/events",
      //   icon: CalendarRangeIcon,
      //   roles: ["mentor", "participant"],
      // },
      {
        title: "Резюме",
        badge: user?.stats.resumes,
        href: "/resumes",
        icon: FileUserIcon,
        roles: ["mentor", "participant"],
      },
      {
        title: "Команды",
        badge: user?.stats.teams,
        href: "/teams",
        icon: UsersIcon,
        roles: ["mentor", "participant"],
      },
    ],
    projects: [
      {
        name: "Финал НТО АБП 2025",
        href: "/events/4",
        type: "olymp",
      },
      {
        name: "Финал PROD 2025",
        href: "/events/3",
        type: "olymp",
      },
      {
        name: "Хакатон PROD 2024",
        href: "/events/2",
        type: "hack",
      },
      {
        name: "Финал НТО АБП 2024",
        href: "/events/1",
        type: "olymp",
      },
    ],
  };

  return (
    <Sidebar variant="floating" className="isolate" {...props}>
      <Sidebar.Header>
        <h1 className="px-2 pt-2 text-lg font-semibold text-accent-foreground md:text-xl">
          Squady
        </h1>
      </Sidebar.Header>
      <Sidebar.Separator className="mx-2 max-md:hidden" />
      <Sidebar.Content>
        <NavMain user={user} items={data.navMain} />
        {user &&
          (user.role === "participant" || user.role === "mentor") &&
          !!teamsMy?.length && (
            <>
              <Sidebar.Separator className="mx-2" />
              <NavTeams teams={teamsMy} />
            </>
          )}
        {/* <NavProjects projects={data.projects} /> */}
      </Sidebar.Content>
      <Sidebar.Footer>
        {user && (
          <>
            <NavUser user={user} />
            <Sidebar.Separator />
          </>
        )}
        <ThemeRadioGroup className="bg-sidebar has-focus-visible:ring-sidebar-ring" />
      </Sidebar.Footer>
    </Sidebar>
  );
}
