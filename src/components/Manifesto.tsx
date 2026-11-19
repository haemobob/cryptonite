"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Stairs from "./Stairs";
import { M } from "@/lib/data";

const STATEMENT =
  "Kami membaca pasar, grafik, dan timeline Anda, lalu menerjemahkannya jadi cerita yang bisa dipahami siapa saja.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // the statement fills in word by word as it scrolls through
      gsap.fromTo(".mw", { opacity: 0.2 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: ".mtext", start: "top 85%", end: "bottom 50%", scrub: true } });
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const k = parseFloat(el.dataset.speed!);
        gsap.fromTo(el, { yPercent: 12 * k }, { yPercent: -12 * k, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="sec !pb-0 bg-black text-paper overflow-hidden">
      <div className="flex justify-between gap-6 lbl muted border-t border-current/20 pt-3">
        <span>Tentang Cryptonite</span>
        <span>Media kripto Indonesia</span>
      </div>

      <div className="mt-10 md:mt-14 grid lg:grid-cols-12 gap-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="mtext t-statement">
            {STATEMENT.split(" ").map((w, i) => <span key={i} className="mw">{w} </span>)}
          </p>
          <p className="t-lead muted mt-8 max-w-xl">
            Edukasi, analisis, berita, dan kabar sosial kripto. Ditulis dalam bahasa Indonesia, untuk pembaca di Instagram, Facebook, dan Threads.
          </p>
        </div>

        <div className="lg:col-span-5 relative min-h-[460px] md:min-h-[560px]">
          <figure data-speed="0.5" className="absolute right-0 top-0 w-[74%]">
            <div className="ht relative aspect-[4/5] vskew" data-reveal>
              <img src={M("jakarta")} alt="Bundaran HI, Jakarta" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <figcaption className="lbl muted mt-2 flex justify-between"><span>Bundaran HI</span><span>Jakarta</span></figcaption>
          </figure>
          <figure data-speed="1.3" className="absolute left-0 bottom-0 w-[48%] border border-white/20 bg-black p-2">
            <div className="ht relative aspect-[4/5] vskew" data-reveal>
              <img src={M("phone-apps")} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </figure>
        </div>
      </div>
      <Stairs to="#f6f6f3" className="-mx-4 md:-mx-8 mt-20 md:mt-28" />
    </section>
  );
}
