import { Middleware } from "openapi-fetch";

import { getSession } from "./session";

export const AUTH_MIDDLEWARE: Middleware = {
  onRequest: async ({ request }) => {
    const session = await getSession();

    if (session && Date.parse(session.expires_at) > Date.now()) {
      request.headers.set(
        "Authorization",
        `${session.token_type} ${session.access_token}`,
      );
    }

    return request;
  },
};
