import { getTeamsMy } from "@/entities/team";
import { getCurrentUser } from "@/entities/user";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
import { AppSidebar } from "@/widgets/sidebar";

export default async function SidebarLayout({
  children,
}: React.PropsWithChildren) {
  const currentUser = await getCurrentUser();
  const teamsMy = await getTeamsMy();

  return (
    <SidebarProvider>
      <AppSidebar user={currentUser} teamsMy={teamsMy} />
      <SidebarInset data-vaul-drawer-wrapper>{children}</SidebarInset>
    </SidebarProvider>
  );
}
