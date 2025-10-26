"use client";

import { startTransition, useActionState, useEffect } from "react";

import { env } from "@/shared/config/client";
import useCountdown from "@/shared/hooks/use-countdown";
import useTimeZone from "@/shared/hooks/use-time-zone";

import { sendOTP } from "../api/actions";

export interface UseOTPProps {
  onSent?: VoidFunction;
}

export default function useOTP({ onSent }: UseOTPProps) {
  const timeZone = useTimeZone();

  const [remaining, restart] = useCountdown(
    env.NEXT_PUBLIC_SQUADY_OTP_RESEND_SECONDS,
  );

  const [otp, resend, sending] = useActionState(
    sendOTP.bind(null, { timeZone }),
    undefined,
  );

  useEffect(() => {
    if (timeZone) {
      startTransition(() => resend());
    }
  }, [timeZone]);

  useEffect(() => {
    if (otp) {
      onSent?.();
      restart();
    }
  }, [otp]);

  return [otp, resend, sending, remaining] as const;
}
