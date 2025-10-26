"use server";

import { client } from "@/shared/api";

export async function sendOTP({ timeZone }: { timeZone: string | null }) {
  const { data } = await client.POST("/auth/otp/send", {
    headers: {
      "X-Timezone": timeZone,
    },
  });

  return data;
}
