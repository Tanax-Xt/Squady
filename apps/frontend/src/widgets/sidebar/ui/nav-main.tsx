"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CurrentUserResponse, UserRole } from "@/shared/api";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";

export function NavMain({
  user,
  items,
}: {
  user?: CurrentUserResponse | undefined;
  items: {
    title: string;
    badge?: string | number;
    href: string;
    icon: LucideIcon;
    roles?: UserRole[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Приложение</SidebarGroupLabel>
      <SidebarMenu>
        {items
          .filter(
            (item) =>
              !item.roles?.length ||
              (user?.role && item.roles?.includes(user.role)),
          )
          .map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={item.href === pathname}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {!!item.badge && (
                <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
