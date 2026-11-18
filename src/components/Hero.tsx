"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HalftoneStage from "./HalftoneStage";
import Ticker from "./Ticker";
import { M, SPOTLIGHT } from "@/lib/data";

const CYCLE = 6;
const IMAGES = SPOTLIGHT.map((s) => M(s.img));
const BASE = 820, THIN = 260, RADIUS = 260;

function Chars({ text }: { text: string }) {
  return <>{[...text].map((c, i) => <span key={i} className="hc inline-block" style={{ fontVariationSettings: `"wght" ${BASE}` }}>{c === " " ? " " : c}</span>)}</>;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const bar = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const circle = root.current!.querySelector<SVGPathElement>(".hero-circle");
    const len = circle?.getTotalLength() ?? 0;
    const ctx = gsap.context(() => {
      if (circle) gsap.set(circle, { strokeDasharray: len, strokeDashoffset: reduce ? 0 : len });
      if (reduce) { gsap.set(".intro-step", { display: "none" }); return; }
      gsap.timeline({ delay: 0.15 })
        .to(".intro-step", { yPercent: -101, duration: 0.9, ease: "power4.inOut", stagger: { each: 0.07, from: "end" } })
        .from(".hero-ln", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.1 }, "-=0.45")
        .to(circle, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, "-=0.3")
        .from(".hero-in", { opacity: 0, y: 14, duration: 0.7, ease: "power2.out", stagger: 0.06 }, "-=0.9");
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-shade", { opacity: 0.75, ease: "none", scrollTrigger: st });
      gsap.to(".hero-stage", { yPercent: 18, scale: 1.06, ease: "none", scrollTrigger: st });
      gsap.to(".hero-head", { yPercent: -30, ease: "none", scrollTrigger: st });
    }, root);

    // letters thin out around the cursor (variable weight axis)
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return () => ctx.revert();
    const chars = gsap.utils.toArray<HTMLElement>(".hc", root.current);
    const w = chars.map(() => BASE);
    let centers: { x: number; y: number }[] = [];
    const measure = () => { centers = chars.map((c) => { const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); };
    const mouse = { x: -9999, y: -9999 };
    const move = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const leave = () => { mouse.x = -9999; };
    let frame = 0;
    const tick = () => {
      if (++frame % 20 === 0) measure();
      chars.forEach((c, i) => {
        const d = Math.hypot(mouse.x - centers[i].x, mouse.y - centers[i].y);
        const k = Math.max(0, 1 - d / RADIUS);
        const target = BASE - (BASE - THIN) * k * k;
        w[i] += (target - w[i]) * 0.16;
        c.style.fontVariationSettings = `"wght" ${w[i].toFixed(0)}`;
      });
    };
    measure();
    gsap.ticker.add(tick);
    root.current!.addEventListener("pointermove", move);
    root.current!.addEventListener("pointerleave", leave);
    const el = root.current!;
    return () => { ctx.revert(); gsap.ticker.remove(tick); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);

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
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 bottom-[48px] px-4 md:px-8 pb-6 md:pb-10 grid md:grid-cols-12 gap-8 items-end pointer-events-none">
        <h1 className="hero-head md:col-span-8 cmp text-[15.5vw] md:text-[10.4vw]" aria-label="Kripto, tanpa basa-basi.">
          <span className="mask" aria-hidden><span className="ln hero-ln cmp-out" data-ink="paper"><Chars text="Kripto," /></span></span>
          <span className="mask overflow-visible" aria-hidden>
            <span className="ln hero-ln">
              <Chars text="Tanpa " />
              <span className="relative inline-block">
                <Chars text="basa-basi." />
                <svg className="absolute -left-[6%] -top-[16%] w-[112%] h-[130%] overflow-visible pointer-events-none" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden>
                  <path className="hero-circle" d="M262 12 C190 -6 40 2 14 40 C-8 74 90 100 176 96 C262 92 312 62 288 30 C270 8 210 4 150 6" fill="none" stroke="var(--blue)" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                </svg>
              </span>
            </span>
          </span>
        </h1>

        <div className="hero-in md:col-span-4 relative handles border border-white/35 bg-black/55 backdrop-blur-sm pointer-events-auto text-paper" onMouseLeave={() => setPaused(false)}>
          <i className="h" /><i className="h" /><i className="h" /><i className="h" />
          <div className="flex justify-between lbl px-4 py-2.5 border-b border-white/20">
            <span>Sorotan hari ini</span>
            <span className="tnum text-paper/70">{idx + 1} / {SPOTLIGHT.length}</span>
          </div>
          <ul>
            {SPOTLIGHT.map((s, i) => (
              <li key={s.title} data-row={i} className={`relative ${i === idx ? "" : "hidden lg:block"}`}>
                <button
                  onMouseEnter={() => { setPaused(true); setIdx(i); }}
                  onFocus={() => { setPaused(true); setIdx(i); }}
                  onClick={() => setIdx(i)}
                  className={`w-full text-left grid grid-cols-[5.5rem_1fr] gap-2 px-4 py-2.5 transition-colors ${i === idx ? "text-white" : "text-paper/45 hover:text-paper"}`}
                >
                  <span className={`lbl pt-0.5 ${i === idx ? "text-sky" : ""}`}>{s.tag}</span>
                  <span className="text-[17px] leading-tight font-semibold">{s.title}</span>
                </button>
                <span className={`row-bar absolute left-0 bottom-0 h-px w-full bg-sky origin-left ${i === idx ? "" : "opacity-0"}`} style={{ transform: "scaleX(0)" }} />
              </li>
            ))}
          </ul>
          <div className="flex justify-end gap-6 lbl px-4 py-2.5 border-t border-white/20">
            <button className="lg:hidden hover:text-sky" onClick={() => { setPaused(true); setIdx((idx + 1) % SPOTLIGHT.length); }}><span className="roll"><span>Berikutnya</span></span></button>
            <a href="#liputan" className="hover:text-sky"><span className="roll"><span>Baca {active.tag.toLowerCase()}</span></span></a>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-black"><Ticker /></div>

      <div className="absolute inset-0 z-[90] flex pointer-events-none" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className={`intro-step flex-1 h-full ${i % 2 ? "bg-blue" : "bg-paper"}`} />)}
      </div>
    </section>
  );
}
