"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Ticker from "./Ticker";

const Shard = dynamic(() => import("./Shard"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const webgl = useSyncExternalStore(() => () => {}, hasWebGL, () => false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      // one orchestrated entrance
      gsap.from(".hero-line", { yPercent: 105, duration: 1.1, ease: "power4.out", stagger: 0.12, delay: 0.1 });
      gsap.from(".hero-fade", { opacity: 0, y: 14, duration: 0.8, ease: "power2.out", stagger: 0.08, delay: 0.7 });
      // words pull apart as the page scrolls
      gsap.to(".hero-a", { xPercent: -14, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-b", { xPercent: 14, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-ink text-paper min-h-[100svh] flex flex-col overflow-hidden">
      <div className="relative flex-1 flex flex-col justify-center pt-28 pb-10">
        <div className="absolute inset-0 pointer-events-none">
          {webgl && (
            <div className="absolute -right-[12%] top-[2%] w-[75vw] h-[38%] md:right-[2%] md:top-[8%] md:w-[46vw] md:h-[80%] pointer-events-auto">
              <Shard />
            </div>
          )}
        </div>

        <h1 className="relative px-4 md:px-8 select-none" aria-label="Cryptonite">
          <span className="mask hero-a">
            <span className="line hero-line display text-[26vw] md:text-[24vw]">Crypto</span>
          </span>
          <span className="mask hero-b -mt-[2vw]">
            <span className="line hero-line display text-[26vw] md:text-[24vw] text-sky">nite</span>
          </span>
        </h1>

        <div className="relative px-4 md:px-8 mt-8 grid md:grid-cols-12 gap-6 items-end">
          <p className="hero-fade md:col-span-5 text-lg md:text-xl leading-snug max-w-md">
            Media kripto Indonesia. Edukasi yang jernih, analisis yang berani, dan kabar sosial sebelum jadi headline.
          </p>
          <div className="hero-fade md:col-start-9 md:col-span-4 flex md:justify-end gap-3 text-sm font-semibold">
            <a href="#pilar" className="bg-blue text-white px-5 py-3 hover:bg-white hover:text-ink transition-colors">Mulai membaca</a>
            <a href="#sosial" className="border border-paper/40 px-5 py-3 hover:border-sky hover:text-sky transition-colors">Radar sosial</a>
          </div>
        </div>
      </div>
      <Ticker />
    </section>
  );
}
