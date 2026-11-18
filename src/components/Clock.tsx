"use client";
import { useEffect, useState } from "react";

const fmtTime = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const fmtDate = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** Live Jakarta time / date. Renders nothing on the server to avoid hydration drift. */
export default function Clock({ kind = "time" }: { kind?: "time" | "date" }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    const first = setTimeout(() => setNow(new Date()), 0);
    return () => { clearInterval(id); clearTimeout(first); };
  }, []);
  if (!now) return <span className="opacity-0">00.00.00</span>;
  return <span className="tnum">{kind === "time" ? `${fmtTime.format(now).replace(/\./g, ":")} WIB` : fmtDate.format(now)}</span>;
}
