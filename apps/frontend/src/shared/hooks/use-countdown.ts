"use client";

import { useEffect, useState } from "react";

export default function useCountdown(initialState: number) {
  const [seconds, setSeconds] = useState<number>(initialState);

  const restart = () => setSeconds(initialState);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return [seconds, restart] as const;
}
