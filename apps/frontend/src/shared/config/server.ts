import crypto from "node:crypto";

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    API_URL: z.string().url(),
    SESSION_SECRET: z
      .string()
      .default(crypto.randomBytes(32).toString("base64")),
    SESSION_COOKIE_NAME: z.string().default("squady_session"),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
