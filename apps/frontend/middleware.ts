import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest): NextResponse {
  const { href, origin } = new URL(request.url);
  const headers = new Headers(request.headers);

  headers.set("Referer", href);
  headers.set("Referer-Origin", origin);

  return NextResponse.next({ request: { headers } });
}
