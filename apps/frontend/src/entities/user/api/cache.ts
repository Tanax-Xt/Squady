"use server";

import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";

import { client } from "@/shared/api";
import {
  redirectToNextURL,
  redirectWithNextURL,
} from "@/shared/lib/navigation";

import {
  USER_CACHE_USERS_ME_PERSONAL_TAG,
  USER_CACHE_USERS_ME_TAG,
} from "./tags";

export const getCurrentUserOrUndefined = cache(async () => {
  const { data } = await client.GET("/users/me", {
    next: {
      tags: [USER_CACHE_USERS_ME_TAG],
      revalidate: 30,
    },
  });

  return data;
});

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

export const getCurrentUserPersonalDataOrUndefined = cache(async () => {
  const { data } = await client.GET("/users/me/personal", {
    next: {
      tags: [USER_CACHE_USERS_ME_PERSONAL_TAG],
      revalidate: 30,
    },
  });

  return data;
});

export interface GetCurrentUserPersonalDataOptions {
  unauthorizedRedirectUrl?: string;
}

export const getCurrentUserPersonalData = cache(
  async ({
    unauthorizedRedirectUrl = "/login",
  }: GetCurrentUserPersonalDataOptions = {}) => {
    const currentUser = await getCurrentUserPersonalDataOrUndefined();

    if (currentUser === undefined) {
      return await redirectWithNextURL(
        unauthorizedRedirectUrl,
        RedirectType.replace,
      );
    }

    return currentUser;
  },
);
