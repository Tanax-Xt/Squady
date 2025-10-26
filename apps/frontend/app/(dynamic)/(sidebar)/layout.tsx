import { getCurrentUser } from "@/entities/user";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
import { AppSidebar } from "@/widgets/sidebar";

export default async function SidebarLayout({
  children,
}: React.PropsWithChildren) {
  const currentUser = await getCurrentUser();

  return (
    <SidebarProvider>
      <AppSidebar user={currentUser} />
      <SidebarInset data-vaul-drawer-wrapper>{children}</SidebarInset>
    </SidebarProvider>
  );
}
