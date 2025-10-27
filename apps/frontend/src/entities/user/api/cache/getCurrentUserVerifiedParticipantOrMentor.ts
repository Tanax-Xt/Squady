"use server";

import { redirect } from "next/navigation";
import { cache } from "react";

import {
  GetCurrentUserVerifiedParticipantOrMentorOrNullOptions,
  getCurrentUserVerifiedParticipantOrMentorOrNull,
} from "./getCurrentUserVerifiedParticipantOrMentorOrNull";

export interface GetCurrentUserVerifiedParticipantOrMentorOptions
  extends GetCurrentUserVerifiedParticipantOrMentorOrNullOptions {}

export const getCurrentUserVerifiedParticipantOrMentor = cache(
  async ({
    forbiddenRedirectUrl = "/settings/role",
    ...options
  }: GetCurrentUserVerifiedParticipantOrMentorOptions = {}) => {
    const { role, ...user } =
      await getCurrentUserVerifiedParticipantOrMentorOrNull(options);

    if (role === null) {
      redirect(forbiddenRedirectUrl);
    }

    return { role, ...user };
  },
);
