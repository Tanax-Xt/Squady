"use server";

import { RedirectType } from "next/navigation";
import { cache } from "react";

import { redirectWithNextURL } from "@/shared/lib/navigation";

import { getCurrentUserOrUndefined } from "./getCurrentUserOrUndefined";

export interface GetCurrentUserOptions {
  unauthorizedRedirectUrl?: string;
}

export const getCurrentUser = cache(
  async ({
    unauthorizedRedirectUrl = "/login",
  }: GetCurrentUserOptions = {}) => {
    const currentUser = await getCurrentUserOrUndefined();

    if (currentUser === undefined) {
      return await redirectWithNextURL(
        unauthorizedRedirectUrl,
        RedirectType.replace,
      );
    }

    return currentUser;
  },
);
