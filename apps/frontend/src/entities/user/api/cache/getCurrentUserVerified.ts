"use server";

import { RedirectType } from "next/navigation";
import { cache } from "react";

import { redirectWithNextURL } from "@/shared/lib/navigation";

import { getCurrentUser, GetCurrentUserOptions } from "./getCurrentUser";

export interface GetCurrentUserVerifiedOptions extends GetCurrentUserOptions {
  unverifiedRedirectUrl?: string;
}

export const getCurrentUserVerified = cache(
  async ({
    unverifiedRedirectUrl = "/settings/verify",
    ...options
  }: GetCurrentUserVerifiedOptions = {}) => {
    const { is_verified, ...user } = await getCurrentUser(options);

    if (is_verified === false) {
      return redirectWithNextURL(unverifiedRedirectUrl, RedirectType.replace);
    }

    return { is_verified, ...user };
  },
);
