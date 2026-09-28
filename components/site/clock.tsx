"use client";

import { useEffect, useState } from "react";

/** Local time where Dylan is. Renders after mount to avoid a hydration mismatch. */
export function Clock({ timeZone, label }: { timeZone: string; label: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-IE", { timeZone, hour: "2-digit", minute: "2-digit" });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <span className="tabular-nums">
      {label} {time ?? "--:--"}
    </span>
  );
}
