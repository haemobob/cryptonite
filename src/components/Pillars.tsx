"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { M, PILLARS } from "@/lib/data";

export default function Pillars() {
  const root = useRef<HTMLElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.from(".pl-word", { yPercent: 105, duration: 1, ease: "power4.out", stagger: 0.08, scrollTrigger: { trigger: ".pl-list", start: "top 78%" } });
        gsap.from(".pl-rule", { scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "power3.inOut", stagger: 0.08, scrollTrigger: { trigger: ".pl-list", start: "top 80%" } });
      }
    }, root);
    // floating preview follows the pointer with a little lag
    const xTo = gsap.quickTo(float.current, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(float.current, "y", { duration: 0.55, ease: "power3.out" });
    const rTo = gsap.quickTo(float.current, "rotate", { duration: 0.8, ease: "power3.out" });
    let lastX = 0;
    let placed = false;
    const move = (e: PointerEvent) => {
      const b = root.current!.getBoundingClientRect();
      if (!placed) { gsap.set(float.current, { x: e.clientX - b.left, y: e.clientY - b.top }); placed = true; }
      xTo(e.clientX - b.left); yTo(e.clientY - b.top);
      rTo(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.6)); lastX = e.clientX;
    };
    root.current!.addEventListener("pointermove", move);
    const el = root.current!;
    return () => { ctx.revert(); el.removeEventListener("pointermove", move); };
  }, []);

  return (
    <section id="pilar" ref={root} className="sec relative bg-black text-paper overflow-hidden">
      <div className="flex justify-between gap-6 lbl muted pt-3 mb-4">
        <span>Pilar</span>
        <span>Empat jenis liputan</span>
      </div>

      <ul className="pl-list" onMouseLeave={() => setHot(null)}>
        {PILLARS.map((p, i) => (
          <li key={p.key} className="relative" onMouseEnter={() => setHot(i)}>
            <span className="pl-rule absolute top-0 inset-x-0 h-px bg-paper/20" />
            <a href="#" data-cursor="Buka" className="group grid md:grid-cols-12 gap-x-6 gap-y-3 py-6 md:py-7 items-center">
              <span className="md:col-span-7 mask">
                <span className={`ln pl-word block t-title transition-colors duration-300 ${hot === null || hot === i ? "" : "cmp-out"}`}>
                  {p.key}
                </span>
              </span>
              <span className="md:col-span-2 lbl text-sky">{p.cadence}</span>
              <span className="md:col-span-3 t-body muted max-w-xs">{p.line}</span>
              {/* small-screen image */}
              <span className="md:hidden ht relative aspect-[16/9] block mt-2" data-reveal><img src={M(p.img)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" /></span>
            </a>
          </li>
        ))}
        <li className="pl-rule h-px bg-paper/20" />
      </ul>

      <div ref={float} className="pointer-events-none absolute left-0 top-0 hidden md:block z-10" aria-hidden>
        <div className={`-translate-x-1/2 -translate-y-1/2 w-[22vw] max-w-[340px] aspect-[4/5] transition-[opacity,scale] duration-300 ${hot === null ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}>
          {PILLARS.map((p, i) => (
            <div key={p.key} className={`ht absolute inset-0 border border-white/30 transition-opacity duration-300 ${hot === i ? "opacity-100" : "opacity-0"}`}>
              <img src={M(p.img)} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
          <span className="absolute -bottom-7 left-0 lbl text-paper">{hot !== null ? PILLARS[hot].key : ""}</span>
        </div>
      </div>
    </section>
  );
}
