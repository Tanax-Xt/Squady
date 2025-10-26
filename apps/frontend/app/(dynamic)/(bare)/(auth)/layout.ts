import { getCurrentUserOrUndefined } from "@/entities/user";
import { redirectToNextURL } from "@/shared/lib/navigation";

export default async function AuthLayout({
  children,
}: React.PropsWithChildren) {
  const currentUser = await getCurrentUserOrUndefined();

  if (currentUser !== undefined) {
    await redirectToNextURL({ fallbackUrl: "/home" });
  }

  return children;
}
