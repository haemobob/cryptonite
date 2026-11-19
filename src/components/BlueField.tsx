"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHead from "./SectionHead";
import Stairs from "./Stairs";
import { M, RADAR, SOCIALS } from "@/lib/data";

const SEGMENTS = 20;

export default function BlueField() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".seg-on", { opacity: 0, duration: 0.02, stagger: { each: 0.012, from: "start" }, scrollTrigger: { trigger: ".bf-table", start: "top 75%" } });
      gsap.fromTo(".bf-thumb", { yPercent: 14 }, { yPercent: -14, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="radar" ref={root} data-cursor-dark className="field relative text-white overflow-hidden [--stroke:#fff]">
      <div className="sec pb-0">
        <SectionHead label="Radar sosial" meta="Intensitas percakapan, 24 jam" outline="Radar" solid="sosial" />

        <div className="mt-12 md:mt-16 grid lg:grid-cols-12 gap-10 lg:gap-8 items-end">
          <p className="lg:col-span-7 t-statement">Kami baca timeline supaya Anda tidak terjebak hype.</p>
          <div className="lg:col-span-5 lg:pl-8 flex gap-6 items-end">
            <figure className="bf-thumb relative shrink-0 w-32 md:w-40 ht aspect-[4/5] border border-white/40">
              <img src={M("hand-btc")} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </figure>
            <div>
              <p className="t-body text-white/85">Narasi kripto lahir di timeline sebelum muncul di grafik. Kami memantau Instagram, Threads, X, dan komunitas setiap jam, lalu memilah mana yang punya dasar.</p>
              <div className="mt-4 flex gap-5 lbl">
                <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hover:text-black"><span className="roll"><span>Instagram</span></span></a>
                <a href={SOCIALS.threads} target="_blank" rel="noreferrer" className="hover:text-black"><span className="roll"><span>Threads</span></span></a>
                <a href={SOCIALS.facebook} target="_blank" rel="noreferrer" className="hover:text-black"><span className="roll"><span>Facebook</span></span></a>
              </div>
            </div>
          </div>
        </div>

        <div className="bf-table mt-14 md:mt-20 border-t border-white/60">
          <ul>
            {RADAR.map((r, i) => {
              const on = Math.round((r.heat / 100) * SEGMENTS);
              const sel = i === active;
              return (
                <li key={r.topic}>
                  <button
                    onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
                    className={`w-full grid grid-cols-[2.4rem_1fr_auto] md:grid-cols-[3rem_1.3fr_1fr_5rem] items-center gap-3 md:gap-6 py-4 border-b border-white/35 text-left transition-colors ${sel ? "bg-white text-blue" : ""}`}
                  >
                    <span className="lbl tnum pl-2">{String(i + 1).padStart(2, "0")}</span>
                    <span className="t-item">{r.topic}</span>
                    <span className="hidden md:flex gap-[3px] h-4" aria-label={`Intensitas ${r.heat} dari 100`}>
                      {Array.from({ length: SEGMENTS }).map((_, k) => (
                        <i key={k} className={`flex-1 ${k < on ? `seg-on ${sel ? "bg-blue" : "bg-white"}` : sel ? "bg-blue/15" : "bg-white/20"}`} />
                      ))}
                    </span>
                    <span className="lbl tnum text-right pr-2">{r.shift}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="lbl text-white/60 mt-3">Data ilustrasi untuk desain</p>
        </div>
      </div>

      <Stairs to="#000" className="mt-20" />
    </section>
  );
}
