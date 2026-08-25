"use client";

import { useEffect, useState } from "react";

const RESET_INTERVAL_MIN = 30;

function getMsUntilReset(now: Date): number {
  const minutesIntoCycle = now.getMinutes() % RESET_INTERVAL_MIN;
  const next = new Date(now);
  next.setMinutes(now.getMinutes() - minutesIntoCycle + RESET_INTERVAL_MIN, 0, 0);
  return next.getTime() - now.getTime();
}

function formatClock(now: Date): string {
  return now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m, ${String(seconds).padStart(2, "0")}s`;
}

export default function ResetCountdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div className="mlvh-reset-clock">
        <span className="mlvh-reset-time">--:--:--</span>
        <span className="mlvh-reset-note">&nbsp;</span>
      </div>
    );
  }

  return (
    <div className="mlvh-reset-clock">
      <span className="mlvh-reset-time">{formatClock(now)}</span>
      <span className="mlvh-reset-note">site resets in {formatCountdown(getMsUntilReset(now))} !</span>
    </div>
  );
}