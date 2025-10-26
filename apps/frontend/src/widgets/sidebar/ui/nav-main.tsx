"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CurrentUserResponse, UserRole } from "@/shared/api";
import Sidebar from "@/shared/ui/sidebar";

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
    <Sidebar.Group>
      <Sidebar.GroupLabel>Приложение</Sidebar.GroupLabel>
      <Sidebar.Menu>
        {items
          .filter(
            (item) =>
              !item.roles?.length ||
              (user?.role && item.roles?.includes(user.role)),
          )
          .map((item) => (
            <Sidebar.MenuItem key={item.href}>
              <Sidebar.MenuButton
                asChild
                tooltip={item.title}
                isActive={item.href === pathname}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </Sidebar.MenuButton>
              {item.badge && (
                <Sidebar.MenuBadge>{item.badge}</Sidebar.MenuBadge>
              )}
            </Sidebar.MenuItem>
          ))}
      </Sidebar.Menu>
    </Sidebar.Group>
  );
}
