import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserAvatar } from "@/entities/user";
import { CurrentUserResponse } from "@/shared/api";
import Sidebar from "@/shared/ui/sidebar";

export function NavUser({ user }: { user: CurrentUserResponse }) {
  const pathname = usePathname();

  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton
          asChild
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          isActive={pathname?.includes("/settings")}
        >
          <Link href="/settings">
            <UserAvatar user={user} className="size-8 text-sm" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user.full_name?.split(" ").slice(0, 2).join(" ") ??
                  user.username}
              </span>
              <span className="truncate font-normal text-muted-foreground">
                {user.email}
              </span>
            </div>
          </Link>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  );
}
