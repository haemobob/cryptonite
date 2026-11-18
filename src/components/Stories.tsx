"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Arrow from "./Arrow";
import { M, STORIES } from "@/lib/data";

const TONES = {
  paper: { card: "bg-white text-ink border-ink", btn: "border-ink hover:bg-ink hover:text-white", tag: "text-blue" },
  blue: { card: "bg-blue text-white border-blue", btn: "border-white hover:bg-white hover:text-blue", tag: "text-white" },
  black: { card: "bg-black text-paper border-black", btn: "border-paper hover:bg-paper hover:text-black", tag: "text-sky" },
} as const;
const TILT = [-2.6, 1.8, -1.4, 2.4, -2, 1.5];

export default function Stories() {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const r = rail.current!;
      const dist = () => r.scrollWidth - window.innerWidth + 64;
      const tween = gsap.to(r, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: ".st-pin", start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.7, invalidateOnRefresh: true },
      });
      // cards straighten as they reach the middle, then tip the other way
      gsap.utils.toArray<HTMLElement>(".st-card").forEach((c, i) => {
        gsap.fromTo(c, { rotate: TILT[i % TILT.length] * 1.8, y: 30 }, {
          rotate: -TILT[i % TILT.length], y: -10, ease: "none",
          scrollTrigger: { trigger: c, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
      });
      gsap.to(".st-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".st-pin", start: "top top", end: () => `+=${dist()}`, scrub: true } });
    });
    const ctx = gsap.context(() => {
      gsap.from(".st-head .ln", { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.08, scrollTrigger: { trigger: ".st-head", start: "top 85%" } });
    }, root);
    return () => { mm.revert(); ctx.revert(); };
  }, []);

  return (
    <section id="liputan" ref={root} className="grain bg-paper text-ink">
      <div className="st-pin lg:h-screen flex flex-col justify-center overflow-hidden pt-24 lg:pt-16 pb-16 lg:pb-8">
        <div className="st-head px-4 md:px-8 flex flex-wrap items-end justify-between gap-6 mb-10 lg:mb-12">
          <h2 className="cmp text-[17vw] sm:text-[12vw] lg:text-[7.4vw]">
            <span className="mask inline-block align-bottom"><span className="ln cmp-out" data-ink="ink">Liputan </span></span>{" "}
            <span className="mask inline-block align-bottom"><span className="ln">terbaru</span></span>
          </h2>
          <a href="#" className="group flex items-center justify-between gap-10 bg-blue text-white cmp text-3xl px-4 py-2.5 min-w-[16rem] hover:bg-ink transition-colors">
            Semua liputan <Arrow className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="overflow-x-auto lg:overflow-visible snap-x snap-mandatory [scrollbar-width:none]">
          <div ref={rail} className="flex gap-6 lg:gap-10 px-4 md:px-8 w-max py-6">
            {STORIES.map((s, i) => {
              const t = TONES[s.tone as keyof typeof TONES];
              return (
                <article key={s.title} className={`st-card group snap-start shrink-0 w-[78vw] sm:w-[340px] lg:w-[min(30vw,420px)] border ${t.card} shadow-[0_24px_50px_-28px_rgba(0,0,0,.45)]`} style={{ rotate: `${TILT[i % TILT.length]}deg` }}>
                  <div className={`ht ${s.tone === "blue" ? "ht-blue" : ""} aspect-[4/4.2] border-b border-inherit`}>
                    <img src={M(s.img)} alt="" className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-700" loading="lazy" />
                  </div>
                  <div className="px-5 pt-4">
                    <div className="flex items-baseline gap-3">
                      <span className={`cmp text-xl ${t.tag}`}>{s.tag}</span>
                      <span className="mono opacity-75">{s.date}</span>
                    </div>
                    <h3 className="cmp text-[2.6rem] lg:text-[clamp(2.2rem,2.9vw,3rem)] mt-2 min-h-[2.6em]">{s.title}</h3>
                  </div>
                  <div className="flex items-stretch justify-between mt-5 border-t border-inherit">
                    <span className="mono self-center px-5">{s.read} baca</span>
                    <a href="#" className={`flex items-center gap-4 cmp text-2xl px-5 py-3 border-l transition-colors ${t.btn}`}>Baca <Arrow /></a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className="hidden lg:block mx-8 mt-8 h-px bg-ink/20"><div className="st-progress h-full bg-blue origin-left scale-x-0" /></div>
      </div>
    </section>
  );
}
