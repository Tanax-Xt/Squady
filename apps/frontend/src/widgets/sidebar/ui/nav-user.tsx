"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserAvatar } from "@/entities/user";
import { CurrentUserResponse } from "@/shared/api";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";

export function NavUser({ user }: { user: CurrentUserResponse }) {
  const pathname = usePathname();
  const isActive = pathname?.includes("/settings");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" isActive={isActive} asChild>
          <Link href="/settings">
            <Item className="gap-2 p-0">
              <ItemMedia className="mt-0.5">
                <UserAvatar user={user} />
              </ItemMedia>
              <ItemContent className="gap-0">
                <ItemTitle className="line-clamp-1">
                  {user.full_name?.split(" ").slice(0, 2).join(" ") ??
                    user.username}
                </ItemTitle>
                <ItemDescription className="line-clamp-1">
                  {user.email}
                </ItemDescription>
              </ItemContent>
            </Item>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
