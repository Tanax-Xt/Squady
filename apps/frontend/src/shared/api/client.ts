import createClient from "openapi-fetch";

import { env } from "@/shared/config/server";

import { AUTH_MIDDLEWARE } from "./middleware";
import { paths } from "./types";

const client = createClient<paths>({ baseUrl: env.API_URL });

client.use(AUTH_MIDDLEWARE);

export default client;
