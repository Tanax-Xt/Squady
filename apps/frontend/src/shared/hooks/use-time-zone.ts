import { useEffect, useState } from "react";

export default function useTimeZone() {
  const [timeZone, setTimezone] = useState<string | null>(null);

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return timeZone;
}
