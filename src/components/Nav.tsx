"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SOCIALS } from "@/lib/data";
import Clock from "./Clock";

const LINKS = [["Liputan", "#liputan"], ["Pilar", "#pilar"], ["Radar", "#radar"], ["Kelas", "#kelas"]] as const;

export default function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.85);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-[60] text-paper transition-colors duration-500 ${solid ? "bg-black" : "bg-transparent"}`}>
      <div className="flex items-center justify-between gap-6 px-4 md:px-8 h-[60px]">
        <a href="#" aria-label="Cryptonite, kembali ke atas" className="shrink-0">
          <Image src="/logo-alpha.png" alt="Cryptonite" width={431} height={72} priority className="h-[22px] md:h-[26px] w-auto" />
        </a>
        <nav className="hidden lg:flex items-center gap-1 mono">
          {LINKS.map(([l, h]) => (
            <a key={l} href={h} className="brk px-2 py-1 hover:text-sky transition-colors">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-5 mono">
          <span className="hidden md:inline text-paper/70"><Clock /></span>
          <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="bg-blue text-white px-3.5 py-2 hover:bg-white hover:text-black transition-colors">Ikuti</a>
        </div>
      </div>
    </header>
  );
}
