"use server";

import { redirect } from "next/navigation";
import { cache } from "react";

import {
  getCurrentUserVerified,
  GetCurrentUserVerifiedOptions,
} from "./getCurrentUserVerified";

export interface GetCurrentUserVerifiedParticipantOrMentorOrNullOptions
  extends GetCurrentUserVerifiedOptions {
  forbiddenRedirectUrl?: string;
}

export const getCurrentUserVerifiedParticipantOrMentorOrNull = cache(
  async ({
    forbiddenRedirectUrl = "/settings",
    ...options
  }: GetCurrentUserVerifiedParticipantOrMentorOrNullOptions = {}) => {
    const { role, ...user } = await getCurrentUserVerified(options);

    if (role === "admin" || role === "agent") {
      redirect(forbiddenRedirectUrl);
    }

    return { role, ...user };
  },
);
