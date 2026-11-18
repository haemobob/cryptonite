"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FEATURED, HEADLINES } from "@/lib/data";

export default function Headlines() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.from(".feat-title .line", { yPercent: 100, duration: 1, ease: "power4.out", stagger: 0.1, scrollTrigger: { trigger: ".feat-title", start: "top 80%" } });
      gsap.from(".hl-row", { opacity: 0, x: 24, duration: 0.7, ease: "power2.out", stagger: 0.09, scrollTrigger: { trigger: ".hl-list", start: "top 80%" } });
      gsap.to(".feat-media", { yPercent: -8, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  const words = FEATURED.title.split(" ");
  const mid = Math.ceil(words.length / 2);
  const lines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];

  return (
    <section id="terbaru" ref={root} className="bg-paper px-4 md:px-8 py-20 md:py-28">
      <div className="flex items-end justify-between mb-10 border-b-2 border-ink pb-4">
        <h2 className="display text-6xl md:text-8xl">Terbaru</h2>
        <span className="text-sm font-semibold hidden md:block">Diperbarui setiap hari</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <article className="lg:col-span-7 group">
          <div className="relative overflow-hidden aspect-[4/3] bg-ink">
            <div className="feat-media absolute -inset-y-[10%] inset-x-0 flex items-center justify-center">
              <span className="display text-sky text-[42vw] lg:text-[22vw] opacity-95 select-none">BTC</span>
            </div>
            <span className="absolute left-4 top-4 bg-blue text-white text-xs font-bold px-2.5 py-1">{FEATURED.tag}</span>
          </div>
          <h3 className="feat-title display-wide text-3xl md:text-5xl mt-6">
            {lines.map((l, i) => (
              <span key={i} className="mask"><span className="line group-hover:underline decoration-blue decoration-4 underline-offset-4">{l}</span></span>
            ))}
          </h3>
          <p className="mt-4 max-w-xl text-lg leading-snug">{FEATURED.dek}</p>
          <p className="mt-3 text-sm font-semibold text-ink/60">{FEATURED.time}</p>
        </article>

        <ul className="hl-list lg:col-span-5 flex flex-col">
          {HEADLINES.map((h) => (
            <li key={h.title} className="hl-row group border-t border-ink/20 first:border-t-0 py-5 cursor-pointer">
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="bg-ink text-paper px-2 py-0.5 group-hover:bg-blue group-hover:text-white transition-colors">{h.tag}</span>
                <span className="text-ink/55 font-semibold">{h.time}</span>
              </div>
              <h4 className="mt-2 text-xl md:text-2xl font-extrabold leading-tight group-hover:translate-x-1.5 transition-transform">{h.title}</h4>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
