"use server";

import { redirect } from "next/navigation";
import { cache } from "react";

import {
  GetCurrentUserVerifiedParticipantOrMentorOptions,
  getCurrentUserVerifiedParticipantOrMentor,
} from "./getCurrentUserVerifiedParticipantOrMentor";
import { hasAnyPersonalData } from "../../lib/hasPersonalData";

export interface GetCurrentUserVerifiedParticipantOrMentorWithPersonalDataOptions
  extends GetCurrentUserVerifiedParticipantOrMentorOptions {
  noPersonalDataRedirectUrl?: string;
}

export const getCurrentUserVerifiedParticipantOrMentorWithPersonalData = cache(
  async ({
    forbiddenRedirectUrl = "/resume/profile/edit",
    ...options
  }: GetCurrentUserVerifiedParticipantOrMentorWithPersonalDataOptions = {}) => {
    const user = await getCurrentUserVerifiedParticipantOrMentor(options);

    if (!hasAnyPersonalData(user)) {
      redirect(forbiddenRedirectUrl);
    }

    return user;
  },
);
