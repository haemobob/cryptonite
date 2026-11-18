"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { M, RADAR, SOCIALS } from "@/lib/data";

const SEGMENTS = 20;

export default function BlueField() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.from(".bf-ln", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.09, scrollTrigger: { trigger: ".bf-head", start: "top 80%" } });
      gsap.from(".seg-on", { opacity: 0, duration: 0.02, stagger: { each: 0.012, from: "start" }, scrollTrigger: { trigger: ".bf-table", start: "top 75%" } });
      gsap.fromTo(".bf-thumb", { yPercent: 30, rotate: -6 }, { yPercent: -30, rotate: 3, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      // stair-step hand-off into the black section below
      gsap.fromTo(".stair", { scaleY: 0 }, { scaleY: 1, ease: "none", stagger: 0.06, scrollTrigger: { trigger: ".stairs", start: "top bottom", end: "bottom 60%", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="radar" ref={root} className="field relative text-white overflow-hidden">
      <div className="px-4 md:px-8 pt-24 md:pt-32">
        <div className="grid md:grid-cols-12 gap-8">
          <figure className="bf-thumb md:col-span-3 w-44 md:w-full max-w-[260px] ht ht-blue aspect-[4/3] border border-white/60">
            <img src={M("hand-btc")} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </figure>
          <div className="md:col-start-7 md:col-span-6 text-[15px] leading-snug font-semibold max-w-xl">
            <p>Narasi kripto lahir di timeline jauh sebelum muncul di grafik. Tim kami memantau Instagram, Threads, X, dan grup komunitas setiap jam.</p>
            <p className="mt-3 text-white/75">Yang kami laporkan bukan sekadar apa yang ramai, tapi apakah keramaian itu punya dasar.</p>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4 mono">
          <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="brk hover:text-black">Instagram</a>
          <span className="flex-1 h-px bg-white/50" />
          <a href={SOCIALS.threads} target="_blank" rel="noreferrer" className="brk hover:text-black">Threads</a>
          <span className="flex-1 h-px bg-white/50" />
          <a href={SOCIALS.facebook} target="_blank" rel="noreferrer" className="brk hover:text-black">Facebook</a>
        </div>

        <h2 className="bf-head cmp text-right text-[14vw] md:text-[9.6vw] mt-16 md:mt-24">
          <span className="mask"><span className="ln bf-ln">Kami baca timeline</span></span>
          <span className="mask"><span className="ln bf-ln"><span className="serif normal-case text-[0.9em] tracking-normal">supaya</span> Anda tidak</span></span>
          <span className="mask"><span className="ln bf-ln">terjebak hype.</span></span>
        </h2>

        <div className="bf-table mt-20 md:mt-28 border-t border-white">
          <div className="flex justify-between mono py-3 border-b border-white/40">
            <span className="brk">Radar sosial</span>
            <span>Intensitas percakapan, 24 jam</span>
          </div>
          <ul>
            {RADAR.map((r, i) => {
              const on = Math.round((r.heat / 100) * SEGMENTS);
              const sel = i === active;
              return (
                <li key={r.topic}>
                  <button
                    onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
                    className={`w-full grid grid-cols-[2.4rem_1fr_auto] md:grid-cols-[3rem_1.3fr_1fr_5rem] items-center gap-3 md:gap-6 py-4 px-1 border-b border-white/40 text-left transition-colors ${sel ? "bg-white text-blue" : ""}`}
                  >
                    <span className="mono tnum pl-2">{String(i + 1).padStart(2, "0")}</span>
                    <span className="cmp text-4xl md:text-6xl">{r.topic}</span>
                    <span className="hidden md:flex gap-[3px] h-5" aria-label={`Intensitas ${r.heat} dari 100`}>
                      {Array.from({ length: SEGMENTS }).map((_, k) => (
                        <i key={k} className={`flex-1 ${k < on ? `seg-on ${sel ? "bg-blue" : "bg-white"}` : sel ? "bg-blue/15" : "bg-white/20"}`} />
                      ))}
                    </span>
                    <span className={`mono tnum text-right pr-2 ${r.shift.startsWith("-") ? (sel ? "text-down" : "text-black") : ""}`}>{r.shift}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mono text-white/60 mt-3">Data ilustrasi untuk desain</p>
        </div>
      </div>

      <div className="stairs mt-24 h-[22vh] flex items-end" aria-hidden>
        {[0.2, 0.35, 0.5, 0.62, 0.74, 0.86, 1].map((h, i) => (
          <div key={i} className="stair flex-1 bg-black origin-bottom" style={{ height: `${h * 100}%` }} />
        ))}
      </div>
    </section>
  );
}
