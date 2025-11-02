"use client";

import {
  CalendarRangeIcon,
  CalendarSearchIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";

function EventSidebarMenuItem() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={`/events/1`}>
          <CalendarRangeIcon />
          <span>Событие</span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuAction>
        <MoreHorizontalIcon />
        <span className="sr-only">Действия с соревнованием</span>
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}

export function NavEvents() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Мои события</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {[1, 2, 3].map((_, index) => (
            <EventSidebarMenuItem key={index} />
          ))}
          <SidebarMenuButton className="text-accent-foreground/75" asChild>
            <Link href="/events#all">
              <CalendarSearchIcon />
              <span>Поиск событий</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
