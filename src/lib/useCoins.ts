"use client";
import { useEffect, useState } from "react";
import { FALLBACK_COINS } from "./data";

export type Coin = { id: string; sym: string; price: number; chg: number };

let cache: Coin[] | null = null;
let pending: Promise<Coin[] | null> | null = null;

/** Prices from CoinGecko's public API, shared by every caller; sample prices until (or unless) it answers. */
export function useCoins() {
  const [coins, setCoins] = useState<Coin[]>(cache ?? FALLBACK_COINS);
  const [live, setLive] = useState(!!cache);
  useEffect(() => {
    if (cache) return;
    let off = false;
    pending ??= fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${FALLBACK_COINS.map((c) => c.id).join(",")}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((rows: { id: string; symbol: string; current_price: number; price_change_percentage_24h: number }[] | null) => {
        if (!Array.isArray(rows) || !rows.length) return null;
        cache = rows.map((r) => ({ id: r.id, sym: r.symbol.toUpperCase(), price: r.current_price, chg: r.price_change_percentage_24h ?? 0 }));
        return cache;
      })
      .catch(() => null);
    pending.then((c) => { if (!off && c) { setCoins(c); setLive(true); } });
    return () => { off = true; };
  }, []);
  return { coins, live };
}

export const fmtPrice = (n: number) =>
  n >= 100 ? n.toLocaleString("en-US", { maximumFractionDigits: 0 }) : n.toLocaleString("en-US", { maximumFractionDigits: 3 });
