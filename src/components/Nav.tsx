"use client";
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type Lenis from "lenis";
import { M, SOCIALS } from "@/lib/data";

const LINKS = [
  { l: "Liputan", h: "#liputan", img: "city-night" },
  { l: "Pilar", h: "#pilar", img: "candles" },
  { l: "Radar sosial", h: "#radar", img: "community" },
  { l: "Kelas", h: "#kelas", img: "laptop-glow" },
] as const;

const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.85);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true })
        .set(panel.current, { visibility: "visible" })
        .fromTo(".mn-step", { yPercent: -101 }, { yPercent: 0, duration: 0.6, ease: "power4.inOut", stagger: 0.05 })
        .fromTo(".mn-link", { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.06 }, "-=0.25")
        .fromTo(".mn-fade", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.5");
    }, panel);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!tl.current) return;
    if (open) { lenis()?.stop(); tl.current.timeScale(1).play(); }
    else { lenis()?.start(); tl.current.timeScale(1.6).reverse(); }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const go = (h: string) => {
    setOpen(false);
    setTimeout(() => { const l = lenis(); if (l) l.scrollTo(h, { duration: 1.4 }); else document.querySelector(h)?.scrollIntoView(); }, 450);
  };

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-[80] text-paper transition-colors duration-500 ${solid && !open ? "bg-black" : "bg-transparent"}`}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-4 md:px-8 h-[64px]">
          <nav className="hidden lg:flex items-center gap-7 lbl">
            {LINKS.map((k) => (
              <a key={k.l} href={k.h} onClick={(e) => { e.preventDefault(); go(k.h); }} className="hover:text-sky transition-colors"><span className="roll"><span>{k.l}</span></span></a>
            ))}
          </nav>
          <a href="#" aria-label="Cryptonite, kembali ke atas" className="col-start-2 justify-self-center" onClick={(e) => { e.preventDefault(); lenis()?.scrollTo(0, { duration: 1.4 }); }}>
            <Image src="/logo-alpha.png" alt="Cryptonite" width={431} height={72} priority className="h-[20px] md:h-[26px] w-auto" />
          </a>
          <div className="col-start-3 justify-self-end flex items-center gap-5 lbl">
            <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hidden sm:inline-block bg-blue text-white px-3.5 py-2 hover:bg-white hover:text-black transition-colors"><span className="roll"><span>Ikuti</span></span></a>
            <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu" className="flex items-center gap-3">
              <span className="roll"><span>{open ? "Tutup" : "Menu"}</span></span>
              <span className="relative w-7 h-3 block" aria-hidden>
                <i className={`absolute left-0 h-[2px] w-full bg-current transition-transform duration-500 ${open ? "top-[5px] rotate-45" : "top-0"}`} />
                <i className={`absolute left-0 h-[2px] w-full bg-current transition-transform duration-500 ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div id="menu" ref={panel} className="fixed inset-0 z-[75] invisible" aria-hidden={!open}>
        <div className="absolute inset-0 flex">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className={`mn-step flex-1 h-full ${i === 4 ? "bg-blue" : "bg-black"}`} />)}
        </div>
        <div className="relative h-full grid lg:grid-cols-12 gap-8 px-4 md:px-8 pt-28 pb-10 text-paper">
          <ul className="lg:col-span-7 flex flex-col justify-center" onMouseLeave={() => setHover(0)}>
            {LINKS.map((k, i) => (
              <li key={k.l} className="mask">
                <a href={k.h} onClick={(e) => { e.preventDefault(); go(k.h); }} onMouseEnter={() => setHover(i)} tabIndex={open ? 0 : -1}
                  className={`mn-link ln cmp block text-[16vw] lg:text-[8.6vw] transition-colors ${hover === i ? "text-paper" : "text-paper/35"}`}>
                  {k.l}
                </a>
              </li>
            ))}
          </ul>
          <div className="mn-fade hidden lg:flex lg:col-span-5 flex-col justify-center">
            <div className="relative aspect-[4/5] w-full max-w-[420px] ml-auto overflow-hidden">
              {LINKS.map((k, i) => (
                <img key={k.l} src={M(k.img)} alt="" className={`absolute inset-0 h-full w-full object-cover transition-[clip-path] duration-700 ease-[cubic-bezier(.7,0,.2,1)] ${hover === i ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"}`} />
              ))}
            </div>
          </div>
          <div className="mn-fade lg:col-span-12 self-end flex flex-wrap gap-x-8 gap-y-2 lbl text-paper/80">
            <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="hover:text-white"><span className="roll"><span>Instagram</span></span></a>
            <a href={SOCIALS.threads} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="hover:text-white"><span className="roll"><span>Threads</span></span></a>
            <a href={SOCIALS.facebook} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="hover:text-white"><span className="roll"><span>Facebook</span></span></a>
            <span className="ml-auto text-paper/50">Media kripto Indonesia</span>
          </div>
        </div>
      </div>
    </>
  );
}
