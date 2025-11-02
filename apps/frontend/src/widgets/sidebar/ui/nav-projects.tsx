import { CodeIcon, MoreHorizontalIcon, TrophyIcon } from "lucide-react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    href: string;
    type: "olymp" | "hack";
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Мои соревнования</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild tooltip={item.name}>
              <Link href={item.href}>
                {item.type === "olymp" ? <TrophyIcon /> : <CodeIcon />}
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Показать ещё">
            <MoreHorizontalIcon />
            <span>Показать ещё</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
