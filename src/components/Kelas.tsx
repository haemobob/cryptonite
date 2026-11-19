"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHead from "./SectionHead";
import { LEVELS } from "@/lib/data";

type Level = keyof typeof LEVELS;
// staircase path through a 6×6 grid, bottom-left to top-right
const PATH: [number, number][] = [[0, 5], [1, 5], [1, 4], [2, 4], [2, 3], [3, 3], [3, 2], [4, 2], [4, 1], [5, 1], [5, 0]];
const STEP: Record<Level, number> = { Pemula: 0, Menengah: 3, Lanjutan: 5 };
// blue, paper and a white checker: the same palette as the rest of the page
const FILLS = ["bg-blue", "bg-paper", "bg-blue", "checker-w bg-black", "bg-blue", "bg-paper"];

export default function Kelas() {
  const [level, setLevel] = useState<Level>("Pemula");
  const [hi, setHi] = useState<number | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const first = useRef(true);

  const lessons = LEVELS[level];
  const cells = PATH.slice(STEP[level], STEP[level] + lessons.length);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sq = grid.current!.querySelectorAll(".sq");
    if (reduce) return;
    if (first.current) {
      first.current = false;
      gsap.set(sq, { scale: 0 });
      const st = ScrollTrigger.create({ trigger: grid.current, start: "top 75%", once: true, onEnter: () => gsap.to(sq, { scale: 1, duration: 0.5, ease: "back.out(1.6)", stagger: 0.09 }) });
      return () => { st.kill(); };
    }
    gsap.fromTo(sq, { scale: 0 }, { scale: 1, duration: 0.45, ease: "back.out(1.6)", stagger: 0.07 });
    gsap.fromTo(".kl-item", { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out", stagger: 0.05 });
  }, [level]);

  return (
    <section id="kelas" ref={root} className="sec bg-black text-paper border-t border-white/10">
      <SectionHead label="Kelas" meta="Gratis, bertahap, berbahasa Indonesia" outline="Belajar" solid="dari nol" />

      <div className="mt-12 md:mt-16 grid lg:grid-cols-12 gap-14 lg:gap-8">
        <div className="lg:col-span-6">
          <p className="t-lead muted max-w-md">
            Kelas yang disusun seperti tangga. Setiap bab membuka bab berikutnya, dari dompet pertama sampai membedah data on-chain sendiri.
          </p>

          <div role="tablist" aria-label="Tingkat kelas" className="mt-8 flex flex-wrap gap-2">
            {(Object.keys(LEVELS) as Level[]).map((k) => (
              <button key={k} role="tab" aria-selected={k === level} onClick={() => { setLevel(k); setHi(null); }}
                className={`btn !gap-0 ${k === level ? "" : "btn-line"}`}>
                {k}
              </button>
            ))}
          </div>

          <ol className="mt-8 border-t border-white/20" onMouseLeave={() => setHi(null)}>
            {lessons.map((t, i) => (
              <li key={t} className="kl-item">
                <button onMouseEnter={() => setHi(i)} onFocus={() => setHi(i)}
                  className={`w-full grid grid-cols-[4rem_1fr_auto] items-baseline py-4 border-b border-white/20 text-left transition-colors ${hi === i ? "text-sky" : ""}`}>
                  <span className="lbl tnum muted">Bab {String(i + 1).padStart(2, "0")}</span>
                  <span className={`t-item ${hi === null || hi === i ? "" : "cmp-out"}`}>{t}</span>
                  <span className={`lbl transition-opacity ${hi === i ? "opacity-100" : "opacity-0"}`}>Mulai</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-6 flex items-center">
          <div ref={grid} className="relative w-full aspect-square grid grid-cols-6 grid-rows-6" aria-hidden>
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(244,243,239,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,243,239,.08)_1px,transparent_1px)] bg-[size:calc(100%/6)_calc(100%/6)]" />
            {cells.map(([c, r], i) => {
              const fill = FILLS[(i + STEP[level]) % FILLS.length];
              return (
                <div key={`${level}-${i}`} className="sq relative" style={{ gridColumn: c + 1, gridRow: r + 1 }}
                  onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)}>
                  <div className={`absolute inset-0 border border-white/40 transition-transform duration-300 ${fill} ${hi === i ? "-translate-y-2 shadow-[0_14px_0_-6px_#0050f0]" : ""}`}>
                    <span className={`absolute left-2 top-1 cmp text-[clamp(1.4rem,3vw,2.6rem)] ${fill.includes("checker") ? "bg-black text-paper px-1" : fill === "bg-paper" ? "text-black" : "text-white"}`}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                </div>
              );
            })}
            <span className="absolute right-0 bottom-0 lbl muted text-right">{level}<br />{lessons.length} bab</span>
          </div>
        </div>
      </div>
    </section>
  );
}
