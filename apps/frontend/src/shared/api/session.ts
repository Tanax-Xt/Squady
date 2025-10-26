"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

import { AccessTokenResponse } from "./types";
import { env } from "../config/server";

const SECRET = new TextEncoder().encode(env.SESSION_SECRET);

export async function getSession() {
  const store = await cookies();

  const cookie = store.get(env.SESSION_COOKIE_NAME);

  if (!cookie) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(cookie.value, SECRET, {
      algorithms: ["HS256"],
    });
    return payload as AccessTokenResponse;
  } catch (error) {
    console.error("Failed to parse session cookie", error);
    return null;
  }
}

export async function setSession(data: AccessTokenResponse) {
  const store = await cookies();

  const encrypted = await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Date.parse(data.expires_at))
    .sign(SECRET);

  store.set(env.SESSION_COOKIE_NAME, encrypted, {
    path: "/",
    secure: false,
    // TODO: Enable only when have HTTPS
    // secure: process.env.NODE_ENV === "production",
    expires: new Date(data.expires_at),
    httpOnly: true,
    sameSite: "lax",
  });
}

export async function clearSession() {
  const store = await cookies();

  store.delete(env.SESSION_COOKIE_NAME);
}
