"use client";

import {
  CalendarRangeIcon,
  FileUserIcon,
  HomeIcon,
  LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { CurrentUserResponse, UserRole } from "@/shared/api";
import Sidebar from "@/shared/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

const data: {
  navMain: {
    title: string;
    badge?: string | number;
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
      badge: 17,
      href: "/resume",
      icon: FileUserIcon,
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
      <Sidebar.Footer>{user && <NavUser user={user} />}</Sidebar.Footer>
    </Sidebar>
  );
}
