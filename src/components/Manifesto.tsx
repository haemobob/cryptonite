"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Sticker from "./Sticker";
import { M } from "@/lib/data";

// Words wrapped in {} get the marker circle; [] gets the underline.
const TEXT =
  "Kami membaca pasar, grafik, dan {timeline} Anda, lalu menerjemahkannya jadi cerita yang bisa dipahami siapa saja. Edukasi, analisis, berita, dan kabar sosial kripto, dari [Indonesia] untuk Indonesia.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const draw = (sel: string, trigger: string, start: string) => {
        const p = root.current!.querySelector<SVGPathElement>(sel);
        if (!p) return;
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: reduce ? 0 : len });
        if (!reduce) gsap.to(p, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", scrollTrigger: { trigger, start } });
      };
      if (!reduce) {
        // words fill in as the paragraph scrolls through the viewport
        gsap.fromTo(".mw", { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: ".mtext", start: "top 78%", end: "bottom 45%", scrub: true } });
        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
          const s = parseFloat(el.dataset.speed!);
          gsap.fromTo(el, { yPercent: 18 * s, rotate: el.dataset.rot0 ? +el.dataset.rot0 : 0 }, {
            yPercent: -18 * s, rotate: el.dataset.rot1 ? +el.dataset.rot1 : 0, ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      }
      draw(".circle-path", ".mark-circle", "top 70%");
      draw(".under-path", ".mark-under", "top 75%");
    }, root);
    return () => ctx.revert();
  }, []);

  const words = TEXT.split(" ");

  return (
    <section className="grain bg-paper text-ink overflow-hidden" ref={root}>
      <div className="relative px-4 md:px-8 pt-28 md:pt-40 pb-24 md:pb-36 grid lg:grid-cols-12 gap-14">
        <p className="mtext lg:col-span-7 cmp text-[12.5vw] sm:text-[9vw] lg:text-[5.4vw] leading-[0.9]">
          {words.map((w, i) => {
            const circle = w.startsWith("{");
            const under = w.startsWith("[");
            const clean = w.replace(/[{}[\]]/g, "");
            if (circle)
              return (
                <span key={i}><span className="mw mark-circle relative inline-block">
                  {clean}
                  <svg className="absolute -inset-x-[12%] -inset-y-[30%] w-[124%] h-[160%] overflow-visible pointer-events-none" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden>
                    <path className="circle-path" d="M168 14 C120 -2 30 4 12 32 C-4 58 60 78 118 74 C176 70 204 46 186 24 C172 8 130 6 96 8" fill="none" stroke="var(--blue)" strokeWidth="3.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                </span>{" "}</span>
              );
            if (under)
              return (
                <span key={i}><span className="mw mark-under relative inline-block">
                  {clean}
                  <svg className="absolute left-0 -bottom-[0.16em] w-full h-[0.22em] overflow-visible pointer-events-none" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden>
                    <path className="under-path" d="M2 12 C50 4 110 6 198 9 M30 16 C80 12 140 13 180 15" fill="none" stroke="var(--blue)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                </span>{" "}</span>
              );
            return <span key={i} className="mw">{clean} </span>;
          })}
        </p>

        {/* collage */}
        <div className="lg:col-span-5 relative min-h-[520px] md:min-h-[640px]">
          <figure data-speed="0.6" data-rot0="-4" data-rot1="-1.5" className="absolute right-0 top-0 w-[78%] handles text-ink">
            <i className="h" /><i className="h" /><i className="h" /><i className="h" />
            <div className="ht aspect-[4/5] border border-ink"><img src={M("jakarta")} alt="Bundaran HI, Jakarta" className="absolute inset-0 h-full w-full object-cover" /></div>
            <figcaption className="mono mt-2 flex justify-between"><span>Bundaran HI</span><span>Jakarta</span></figcaption>
          </figure>
          <figure data-speed="1.4" data-rot0="5" data-rot1="2" className="absolute left-0 bottom-6 w-[52%] bg-blue p-2.5 shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)]">
            <div className="aspect-[4/5] relative overflow-hidden"><img src={M("phone-apps")} alt="" className="absolute inset-0 h-full w-full object-cover" /></div>
          </figure>
          <div data-speed="2" className="absolute left-[40%] top-[38%]">
            <Sticker text="MEDIA KRIPTO INDONESIA ✦ EDUKASI ✦ ANALISIS ✦ BERITA ✦ " size={128} />
          </div>
          <span data-speed="1" data-rot0="-6" data-rot1="-3" className="absolute left-[2%] top-[14%] mono border border-ink bg-paper px-3 py-2">Bahasa Indonesia</span>
          <span data-speed="1.7" data-rot0="4" data-rot1="7" className="absolute right-[4%] bottom-[2%] mono border border-ink bg-paper px-3 py-2 max-w-[13rem] leading-snug">Instagram, Facebook, Threads. Satu sumber.</span>
        </div>
      </div>
    </section>
  );
}
