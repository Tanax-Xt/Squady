"use server";

import { getCurrentUserVerifiedParticipantOrMentorWithPersonalData } from "@/entities/user";

export default async function SidebarResumeFormLayout({
  children,
}: React.PropsWithChildren) {
  await getCurrentUserVerifiedParticipantOrMentorWithPersonalData();

  return children;
}
