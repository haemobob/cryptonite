"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SOCIALS } from "@/lib/data";

export default function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${solid ? "bg-ink text-paper" : "text-paper"}`}>
      <div className="flex items-center justify-between px-4 md:px-8 h-16">
        <a href="#" aria-label="Cryptonite"><Image src="/logo.png" alt="Cryptonite" width={431} height={72} priority className="h-7 md:h-8 w-auto" /></a>
        <nav className="hidden md:flex gap-8 text-sm font-semibold">
          {[["Berita", "#terbaru"], ["Pilar", "#pilar"], ["Radar", "#sosial"], ["Kelas", "#kelas"], ["Sosmed", "#feed"]].map(([l, h]) => (
            <a key={l} href={h} className="hover:text-sky transition-colors">{l}</a>
          ))}
        </nav>
        <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="bg-blue text-white text-sm font-bold px-4 py-2 hover:bg-white hover:text-ink transition-colors">Ikuti</a>
      </div>
    </header>
  );
}
