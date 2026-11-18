"use client";
import { useEffect, useState } from "react";
import { FALLBACK_COINS } from "@/lib/data";

type Coin = { id: string; sym: string; price: number; chg: number };

function fmt(n: number) {
  return n >= 100 ? n.toLocaleString("en-US", { maximumFractionDigits: 0 }) : n.toLocaleString("en-US", { maximumFractionDigits: 3 });
}

export default function Ticker() {
  const [coins, setCoins] = useState<Coin[]>(FALLBACK_COINS);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let off = false;
    const ids = FALLBACK_COINS.map((c) => c.id).join(",");
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`)
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
  return (
    <div className="relative border-t border-paper/15 bg-ink text-paper overflow-hidden" role="marquee" aria-label="Harga kripto">
      <div className="flex w-max" style={{ animation: "marquee 38s linear infinite" }}>
        {row.map((c, i) => (
          <div key={i} className="flex items-baseline gap-3 px-6 py-3.5 border-r border-paper/10 tnum whitespace-nowrap">
            <span className="font-extrabold">{c.sym}</span>
            <span>${fmt(c.price)}</span>
            <span className={c.chg >= 0 ? "text-up" : "text-down"}>{c.chg >= 0 ? "▲" : "▼"} {Math.abs(c.chg).toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-ink pl-3 text-[11px] flex items-center gap-1.5 text-paper/70">
        <i className={`inline-block size-1.5 rounded-full ${live ? "bg-up" : "bg-paper/40"}`} style={live ? { animation: "blink 1.6s infinite" } : undefined} />
        {live ? "Langsung" : "Contoh"}
      </span>
    </div>
  );
}
