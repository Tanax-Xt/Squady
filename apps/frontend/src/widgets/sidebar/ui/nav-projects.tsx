import { CodeIcon, MoreHorizontalIcon, TrophyIcon } from "lucide-react";
import Link from "next/link";

import Sidebar from "@/shared/ui/sidebar";

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
    <Sidebar.Group>
      <Sidebar.GroupLabel>Мои соревнования</Sidebar.GroupLabel>
      <Sidebar.Menu>
        {projects.map((item) => (
          <Sidebar.MenuItem key={item.name}>
            <Sidebar.MenuButton asChild tooltip={item.name}>
              <Link href={item.href}>
                {item.type === "olymp" ? <TrophyIcon /> : <CodeIcon />}
                <span>{item.name}</span>
              </Link>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        ))}
        <Sidebar.MenuItem>
          <Sidebar.MenuButton tooltip="Показать ещё">
            <MoreHorizontalIcon />
            <span>Показать ещё</span>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
  );
}
