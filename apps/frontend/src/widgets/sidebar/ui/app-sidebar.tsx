"use client";

import {
  CalendarRangeIcon,
  FileUserIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  LucideIcon,
  UsersIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  CurrentUserResponse,
  ResumeResponse,
  TeamResponse,
  UserRole,
} from "@/shared/api";
import ThemeRadioGroup from "@/shared/ui/ThemeRadioGroup";
import { Separator } from "@/shared/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/shared/ui/sidebar";

import { NavEvents } from "./nav-events";
import { NavMain } from "./nav-main";
import { NavResumes } from "./nav-resumes";
import { NavTeams } from "./nav-teams";
import { NavUser } from "./nav-user";

export function AppSidebar({
  user,
  resumes,
  teamsMy,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: CurrentUserResponse;
  resumes: ResumeResponse[] | undefined;
  teamsMy: TeamResponse[] | undefined;
}) {
  const pathname = usePathname();
  const sidebar = useSidebar();

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
      {
        title: "События",
        href: "/events",
        icon: CalendarRangeIcon,
        roles: ["mentor", "participant", "agent"],
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
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="flex flex-row items-center justify-between p-4">
        <span className="text-xl font-semibold">Squady</span>
        <ThemeRadioGroup className="bg-sidebar has-focus-visible:ring-sidebar-ring" />
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <NavMain user={user} items={data.navMain} />

        {(user.role === "participant" || user.role === "mentor") && (
          <>
            <NavResumes resumes={resumes} />
            <NavTeams user={user} teams={teamsMy} />
            <NavEvents />
          </>
        )}
      </SidebarContent>

      <Separator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-accent-foreground/75">
              <LifeBuoyIcon />
              Помощь
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="-mx-2">
          <SidebarSeparator className="mx-0" />
        </div>

        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
