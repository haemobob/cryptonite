"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HalftoneStage from "./HalftoneStage";
import Ticker from "./Ticker";
import Clock from "./Clock";
import { M, SPOTLIGHT } from "@/lib/data";

const CYCLE = 6;
const IMAGES = SPOTLIGHT.map((s) => M(s.img));

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const bar = useRef<gsap.core.Tween | null>(null);

  // intro: stepped blocks lift away, then type rises — one orchestrated entrance
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) { gsap.set(".intro-step", { display: "none" }); return; }
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(".intro-step", { yPercent: -101, duration: 0.9, ease: "power4.inOut", stagger: { each: 0.07, from: "end" } })
        .from(".hero-ln", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.1 }, "-=0.45")
        .from(".hero-in", { opacity: 0, y: 12, duration: 0.7, ease: "power2.out", stagger: 0.06 }, "-=0.8");

      // scroll: the stage sinks and darkens, headline drifts slower than the page
      gsap.to(".hero-shade", { opacity: 0.75, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-stage", { yPercent: 18, scale: 1.06, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-head", { yPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  // auto-advance the spotlight, with a progress bar on the active row
  useEffect(() => {
    if (paused) { bar.current?.pause(); return; }
    const el = root.current?.querySelector<HTMLElement>(`[data-row="${idx}"] .row-bar`);
    if (!el) return;
    bar.current?.kill();
    bar.current = gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: CYCLE, ease: "none", onComplete: () => setIdx((i) => (i + 1) % SPOTLIGHT.length) });
    return () => { bar.current?.kill(); };
  }, [idx, paused]);

  const active = SPOTLIGHT[idx];

  return (
    <section ref={root} className="relative h-[100svh] min-h-[680px] bg-black text-paper overflow-hidden">
      <div className="hero-stage absolute inset-0 will-change-transform">
        <HalftoneStage images={IMAGES} index={idx} />
      </div>
      <div className="hero-shade absolute inset-0 bg-black opacity-0 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

      {/* meta row */}
      <div className="hero-in absolute top-[76px] inset-x-0 px-4 md:px-8 flex justify-between mono text-paper/75 pointer-events-none">
        <span className="hidden sm:inline"><Clock kind="date" /></span>
        <span className="hidden sm:inline">Jakarta  −6.1944, 106.8229</span>
      </div>

      <div className="absolute inset-x-0 bottom-[46px] px-4 md:px-8 pb-6 md:pb-10 grid lg:grid-cols-12 gap-8 items-end pointer-events-none">
        <h1 className="hero-head lg:col-span-8 cmp text-[17vw] sm:text-[14vw] lg:text-[10.6vw]">
          <span className="mask"><span className="ln hero-ln cmp-out" data-ink="paper">Kripto,</span></span>
          <span className="mask"><span className="ln hero-ln">tanpa <span className="serif text-sky lowercase tracking-normal">basa-basi.</span></span></span>
        </h1>

        {/* spotlight index — hover to preview, auto-advances */}
        <div
          className="hero-in lg:col-span-4 handles border border-white/35 bg-black/55 backdrop-blur-sm pointer-events-auto text-paper"
          onMouseLeave={() => setPaused(false)}
        >
          <i className="h" /><i className="h" /><i className="h" /><i className="h" />
          <div className="flex justify-between mono px-4 py-2.5 border-b border-white/20">
            <span className="brk">Sorotan</span>
            <span className="tnum">{String(idx + 1).padStart(2, "0")}/{String(SPOTLIGHT.length).padStart(2, "0")}</span>
          </div>
          <ul>
            {SPOTLIGHT.map((s, i) => (
              <li key={s.title} data-row={i} className={`relative ${i === idx ? "" : "hidden lg:block"}`}>
                <button
                  onMouseEnter={() => { setPaused(true); setIdx(i); }}
                  onFocus={() => { setPaused(true); setIdx(i); }}
                  onClick={() => setIdx(i)}
                  className={`w-full text-left grid grid-cols-[2.6rem_1fr] gap-2 px-4 py-2.5 transition-colors ${i === idx ? "text-white" : "text-paper/50 hover:text-paper"}`}
                >
                  <span className="mono pt-0.5 tnum">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] leading-snug font-semibold">{s.title}</span>
                </button>
                <span className={`row-bar absolute left-0 bottom-0 h-px w-full bg-sky origin-left ${i === idx ? "" : "opacity-0"}`} style={{ transform: "scaleX(0)" }} />
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mono px-4 py-2.5 border-t border-white/20">
            <span className="text-sky">{active.tag}</span>
            <span className="flex gap-4">
              <button className="lg:hidden uppercase hover:text-sky" onClick={() => { setPaused(true); setIdx((idx + 1) % SPOTLIGHT.length); }}>Berikutnya</button>
              <a href="#liputan" className="hover:text-sky">Baca liputan</a>
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-black"><Ticker /></div>

      {/* intro curtain */}
      <div className="absolute inset-0 z-[70] flex pointer-events-none" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`intro-step flex-1 h-full ${i % 2 ? "bg-blue" : "bg-paper"}`} />
        ))}
      </div>
    </section>
  );
}
