"use client";
import { useEffect, useState } from "react";
import { FALLBACK_COINS } from "@/lib/data";

type Coin = { id: string; sym: string; price: number; chg: number };
const fmt = (n: number) => n >= 100 ? n.toLocaleString("en-US", { maximumFractionDigits: 0 }) : n.toLocaleString("en-US", { maximumFractionDigits: 3 });

export default function Ticker({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [coins, setCoins] = useState<Coin[]>(FALLBACK_COINS);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let off = false;
    const ids = FALLBACK_COINS.map((c) => c.id).join(",");
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows: { id: string; symbol: string; current_price: number; price_change_percentage_24h: number }[]) => {
        if (off || !Array.isArray(rows) || !rows.length) return;
        setCoins(rows.map((r) => ({ id: r.id, sym: r.symbol.toUpperCase(), price: r.current_price, chg: r.price_change_percentage_24h ?? 0 })));
        setLive(true);
      })
      .catch(() => {});
    return () => { off = true; };
  }, []);
  const row = [...coins, ...coins];
  const dark = tone === "dark";
  return (
    <div className={`relative overflow-hidden mono ${dark ? "text-paper border-t border-white/15" : "text-ink border-y border-ink"}`} aria-label="Harga kripto">
      <div className="flex w-max" style={{ animation: "marquee 42s linear infinite" }}>
        {row.map((c, i) => (
          <span key={i} className={`flex items-baseline gap-2.5 px-5 py-3 tnum whitespace-nowrap border-r ${dark ? "border-white/10" : "border-ink/20"}`}>
            <b className="font-bold">{c.sym}</b>
            <span>${fmt(c.price)}</span>
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
