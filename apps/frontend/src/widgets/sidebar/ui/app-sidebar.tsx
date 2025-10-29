"use client";

import {
  CalendarRangeIcon,
  FileUserIcon,
  HomeIcon,
  LucideIcon,
  ShieldHalfIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { CurrentUserResponse, UserRole } from "@/shared/api";
import ThemeRadioGroup from "@/shared/ui/ThemeRadioGroup";
import Sidebar from "@/shared/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user?: CurrentUserResponse }) {
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
        title: "Главная",
        href: "/home",
        icon: HomeIcon,
      },
      {
        title: "Соревнования",
        href: "/events",
        icon: CalendarRangeIcon,
        roles: ["mentor", "participant"],
      },
      {
        title: "Мои резюме",
        badge: user?.stats.resumes,
        href: "/resumes",
        icon: FileUserIcon,
        roles: ["mentor", "participant"],
      },
      {
        title: "Команды",
        badge: 0, // TODO
        href: "/teams",
        icon: ShieldHalfIcon,
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
        {!sidebar.isMobile && <Sidebar.Trigger />}
        <h1 className="px-2 pt-2 text-xl font-semibold text-accent-foreground md:text-2xl">
          Squady
        </h1>
      </Sidebar.Header>
      <Sidebar.Separator className="mx-2 max-md:hidden" />
      <Sidebar.Content>
        <NavMain user={user} items={data.navMain} />
        <Sidebar.Separator className="mx-2" />
        <NavProjects projects={data.projects} />
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
