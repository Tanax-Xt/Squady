"use server";

import { cache } from "react";

import { redirectToNextURL } from "@/shared/lib/navigation";

import { getCurrentUser, GetCurrentUserOptions } from "./getCurrentUser";

export interface GetCurrentUserUnverifiedOptions extends GetCurrentUserOptions {
  verifiedRedirectUrl?: string;
}

export const getCurrentUserUnverified = cache(
  async ({
    verifiedRedirectUrl = "/settings",
    ...options
  }: GetCurrentUserUnverifiedOptions = {}) => {
    const { is_verified, ...user } = await getCurrentUser(options);

    if (is_verified === true) {
      return redirectToNextURL({ fallbackUrl: verifiedRedirectUrl });
    }

    return { is_verified, ...user };
  },
);
