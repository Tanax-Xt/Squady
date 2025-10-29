import { getCurrentUserVerifiedParticipantOrMentorWithPersonalData } from "@/entities/user";

export default async function SidebarResumeFormLayout({
  children,
}: React.PropsWithChildren) {
  const user =
    await getCurrentUserVerifiedParticipantOrMentorWithPersonalData();

  return user ? children : null;
}
