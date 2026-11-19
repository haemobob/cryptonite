"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Arrow from "./Arrow";
import SectionHead from "./SectionHead";
import Ticker from "./Ticker";
import { M, STORIES } from "@/lib/data";

const TILT = [-1.2, 0.9, -0.7, 1.1, -1, 0.8];

export default function Stories() {
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
      // cards settle level as they cross the middle of the screen
      gsap.utils.toArray<HTMLElement>(".st-card").forEach((c, i) => {
        gsap.fromTo(c, { rotate: TILT[i % TILT.length] * 2, y: 24 }, {
          rotate: -TILT[i % TILT.length], y: -8, ease: "none",
          scrollTrigger: { trigger: c, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
      });
      gsap.to(".st-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".st-pin", start: "top top", end: () => `+=${dist()}`, scrub: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="liputan" className="theme-light">
      <Ticker tone="light" />
      <div className="st-pin lg:h-screen flex flex-col justify-start overflow-hidden pt-16 lg:pt-[max(84px,10vh)] pb-16 lg:pb-[3vh]">
        <SectionHead
          className="px-4 md:px-8 mb-8 lg:mb-[2.5vh] lg:[&_.t-title]:text-[min(8.2vw,11.5vh)]"
          label="Liputan" meta="Diperbarui setiap hari" outline="Liputan" solid="terbaru"
          action={<a href="#" className="btn group min-w-[15rem]"><span className="roll"><span>Semua liputan</span></span><Arrow className="group-hover:translate-x-1 transition-transform" /></a>}
        />

        <div className="overflow-x-auto lg:overflow-visible snap-x snap-mandatory [scrollbar-width:none]">
          <div ref={rail} className="flex gap-5 lg:gap-8 px-4 md:px-8 w-max py-5">
            {STORIES.map((s, i) => (
              <article key={s.title} data-cursor="Baca" className="st-card group snap-start shrink-0 w-[78vw] sm:w-[340px] lg:w-[min(26vw,380px,calc((100vh-290px)*0.6))] bg-white border border-ink/15 shadow-[0_18px_40px_-28px_rgba(0,0,0,.35)]" style={{ rotate: `${TILT[i % TILT.length]}deg` }}>
                <div className="ht relative aspect-[4/4.2] lg:aspect-[4/3.5]">
                  <img src={M(s.img)} alt="" className="absolute -inset-[4%] h-[108%] w-[108%] object-cover vskew" loading="lazy" />
                </div>
                <div className="px-5 pt-4">
                  <div className="flex items-baseline gap-3 lbl">
                    <span className="text-blue">{s.tag}</span>
                    <span className="muted">{s.date}</span>
                  </div>
                  <h3 className="t-card mt-2 min-h-[2.8em]">{s.title}</h3>
                </div>
                <div className="flex items-stretch justify-between mt-5 border-t border-ink/15 lbl">
                  <span className="self-center px-5 muted">{s.read} baca</span>
                  <a href="#" className="flex items-center gap-3 px-5 py-3 border-l border-ink/15 group-hover:bg-blue group-hover:text-white transition-colors">Baca <Arrow /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="hidden lg:block mx-8 mt-[2vh] h-px bg-ink/15"><div className="st-progress h-full bg-blue origin-left scale-x-0" /></div>
      </div>
    </section>
  );
}
