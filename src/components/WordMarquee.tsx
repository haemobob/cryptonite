"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WORDS } from "@/lib/data";

// the two treatments only: solid and outline
const STYLE = ["", "cmp-out", "", "", "cmp-out", "", "cmp-out"];

// Two rows of words drifting in opposite directions; scroll speed pushes them along.
export default function WordMarquee() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rows = gsap.utils.toArray<HTMLElement>(".wm-row", root.current);
    const loops = rows.map((r, i) => {
      const tw = gsap.to(r, { xPercent: -50, duration: 38 + i * 6, ease: "none", repeat: -1 });
      if (i % 2) tw.timeScale(-1);
      return tw;
    });
    const st = ScrollTrigger.create({
      trigger: root.current, start: "top bottom", end: "bottom top",
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 250);
        loops.forEach((l, i) => {
          const dir = (i % 2 ? -1 : 1) * (self.direction || 1);
          gsap.to(l, { timeScale: dir * (1 + Math.abs(v)), duration: 0.25, overwrite: true });
          gsap.to(l, { timeScale: dir, duration: 1.2, delay: 0.25, ease: "power2.out" });
        });
      },
    });
    return () => { st.kill(); loops.forEach((l) => l.kill()); };
  }, []);

  return (
    <section ref={root} className="bg-black text-paper overflow-hidden py-16 md:py-24 select-none border-t border-white/10" aria-label="Topik yang kami liput">
      {WORDS.map((row, r) => (
        <div key={r} className="flex">
          <div className="wm-row flex w-max shrink-0">
            {[...row, ...row].map((w, i) => (
              <span key={i} className={`cmp text-[20vw] md:text-[min(10.5vw,18vh)] pr-[0.22em] whitespace-nowrap ${STYLE[(i + r * 3) % STYLE.length]}`}>{w}</span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
