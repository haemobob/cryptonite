"use client";
import { fmtPrice, useCoins } from "@/lib/useCoins";

export default function Ticker({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { coins, live } = useCoins();
  const row = [...coins, ...coins];
  const dark = tone === "dark";
  return (
    <div className={`relative overflow-hidden lbl ${dark ? "text-paper border-t border-white/15" : "text-ink border-y border-ink"}`} aria-label="Harga kripto">
      <div className="flex w-max" style={{ animation: "marquee 42s linear infinite" }}>
        {row.map((c, i) => (
          <span key={i} className={`flex items-baseline gap-2.5 px-5 py-3 tnum whitespace-nowrap border-r ${dark ? "border-white/10" : "border-ink/20"}`}>
            <b className="font-[850]">{c.sym}</b>
            <span>${fmtPrice(c.price)}</span>
            <span className={c.chg >= 0 ? "text-up" : "text-down"}>{c.chg >= 0 ? "+" : "−"}{Math.abs(c.chg).toFixed(1)}%</span>
          </span>
        ))}
      </div>
      <span className={`absolute right-0 inset-y-0 flex items-center gap-1.5 pl-4 pr-4 ${dark ? "bg-black" : "bg-paper"}`}>
        <i className={`inline-block size-1.5 rounded-full ${live ? "bg-up" : "bg-current opacity-40"}`} style={live ? { animation: "blink 1.6s infinite" } : undefined} />
        {live ? "Langsung" : "Contoh"}
      </span>
    </div>
  );
}
