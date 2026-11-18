"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PILLARS } from "@/lib/data";

export default function Pillars() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth;
      const tween = gsap.to(t, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
      gsap.utils.toArray<HTMLElement>(".pillar-word").forEach((el) => {
        gsap.from(el, { xPercent: 18, ease: "none", scrollTrigger: { trigger: el.closest(".pillar"), containerAnimation: tween, start: "left 100%", end: "left 20%", scrub: true } });
      });
      gsap.to(".pillar-bar", { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, scrub: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="pilar" ref={root} className="relative bg-ink overflow-hidden">
      <div className="hidden md:block absolute top-0 inset-x-0 h-1.5 bg-paper/10 z-10">
        <div className="pillar-bar h-full bg-sky origin-left scale-x-0" />
      </div>
      <div ref={track} className="flex flex-col md:flex-row md:w-max md:h-screen">
        {PILLARS.map((p) => (
          <article key={p.key} className="pillar w-full md:w-screen md:h-screen shrink-0 px-4 md:px-8 py-16 md:py-10 flex flex-col justify-end md:justify-between" style={{ background: p.bg, color: p.fg }}>
            <div className="md:mt-auto">
              <h2 className="pillar-word display text-[24vw] md:text-[19vw] whitespace-nowrap">{p.key}</h2>
              <p className="display-wide text-2xl md:text-4xl mt-4">{p.line}</p>
            </div>
            <div className="grid md:grid-cols-12 gap-6 items-end mt-10">
              <p className="md:col-span-5 text-lg leading-snug">{p.body}</p>
              <ul className="md:col-start-8 md:col-span-5 flex flex-wrap gap-2">
                {p.items.map((it) => (
                  <li key={it} className="border-2 px-3 py-1.5 text-sm font-bold hover:bg-current hover:[&>span]:invert transition-colors cursor-default" style={{ borderColor: p.fg }}>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
