"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { LEVELS } from "@/lib/data";

type Level = keyof typeof LEVELS;

export default function Kelas() {
  const [level, setLevel] = useState<Level>("Pemula");
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(body.current!.querySelectorAll(".swap"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.06 });
  }, [level]);

  const L = LEVELS[level];
  return (
    <section id="kelas" className="bg-blue text-white px-4 md:px-8 py-20 md:py-28">
      <h2 className="display text-7xl md:text-[10rem]">Kelas</h2>
      <div role="tablist" className="flex flex-wrap gap-2 mt-8">
        {(Object.keys(LEVELS) as Level[]).map((k) => (
          <button key={k} role="tab" aria-selected={k === level} onClick={() => setLevel(k)}
            className={`px-6 py-3 text-lg font-extrabold border-2 border-white transition-colors ${k === level ? "bg-white text-blue" : "hover:bg-white/15"}`}>
            {k}
          </button>
        ))}
      </div>
      <div ref={body} className="grid md:grid-cols-12 gap-10 mt-12">
        <p className="swap md:col-span-5 text-2xl md:text-3xl font-extrabold leading-tight">{L.blurb}</p>
        <ol className="md:col-span-7 border-t-2 border-white">
          {L.lessons.map((t, i) => (
            <li key={t} className="swap group flex items-center justify-between py-5 border-b-2 border-white cursor-pointer">
              <span className="display-wide text-xl md:text-3xl group-hover:translate-x-2 transition-transform">{t}</span>
              <span className="tnum text-sm font-bold">Bab {i + 1}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
