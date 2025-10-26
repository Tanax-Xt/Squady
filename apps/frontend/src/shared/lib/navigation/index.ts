"use server";

import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { getURLPath, isRelativeURL } from "./utils";

export async function redirectToNextURL({
  fallbackUrl,
}: {
  fallbackUrl: string;
}): Promise<never> {
  const headersList = await headers();

  const referer = headersList.get("referer");

  if (!referer) {
    redirect(fallbackUrl);
  }

  const encodedNextUrl = new URL(referer).searchParams.get("next");

  if (encodedNextUrl) {
    const decodedNextUrl = decodeURIComponent(encodedNextUrl);

    if (isRelativeURL(decodedNextUrl)) {
      redirect(decodedNextUrl);
    }
  }

  redirect(fallbackUrl);
}

export async function redirectWithNextURL(
  url: string,
  type?: RedirectType,
): Promise<never> {
  const headersList = await headers();

  const referer = headersList.get("referer");
  const refererOrigin = headersList.get("referer-origin");

  if (!referer || !refererOrigin) {
    redirect(url, type);
  }

  const refererUrl = new URL(referer);
  const redirectUrl = new URL(url, refererOrigin);

  redirectUrl.searchParams.set("next", getURLPath(refererUrl));

  redirect(getURLPath(redirectUrl), type);
}
