"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LEVELS } from "@/lib/data";

type Level = keyof typeof LEVELS;
// staircase path through a 6×6 grid, bottom-left to top-right
const PATH: [number, number][] = [[0, 5], [1, 5], [1, 4], [2, 4], [2, 3], [3, 3], [3, 2], [4, 2], [4, 1], [5, 1], [5, 0]];
const STEP: Record<Level, number> = { Pemula: 0, Menengah: 3, Lanjutan: 5 };
const FILLS = ["bg-blue", "bg-ink", "bg-blue", "checker bg-paper", "bg-blue", "bg-ink"];

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
      const ctx = gsap.context(() => {
        gsap.from(".kl-ln", { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.08, scrollTrigger: { trigger: ".kl-head", start: "top 80%" } });
      }, root);
      return () => { st.kill(); ctx.revert(); };
    }
    gsap.fromTo(sq, { scale: 0 }, { scale: 1, duration: 0.45, ease: "back.out(1.6)", stagger: 0.07 });
    gsap.fromTo(".kl-item", { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out", stagger: 0.05 });
  }, [level]);

  return (
    <section id="kelas" ref={root} className="grain bg-paper text-ink px-4 md:px-8 py-24 md:py-36">
      <div className="grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-6">
          <h2 className="kl-head cmp text-[18vw] sm:text-[13vw] lg:text-[7.6vw]">
            <span className="mask"><span className="ln kl-ln cmp-out" data-ink="ink">Belajar</span></span>
            <span className="mask"><span className="ln kl-ln">dari nol.</span></span>
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-snug font-semibold">
            Kelas bertahap yang disusun seperti tangga. Setiap bab membuka bab berikutnya, dari dompet pertama sampai membedah data on-chain sendiri.
          </p>

          <div role="tablist" aria-label="Tingkat kelas" className="mt-10 flex flex-wrap gap-2 lbl">
            {(Object.keys(LEVELS) as Level[]).map((k) => (
              <button key={k} role="tab" aria-selected={k === level} onClick={() => { setLevel(k); setHi(null); }}
                className={`px-3.5 py-2 border border-ink transition-colors ${k === level ? "bg-blue border-blue text-white" : "hover:bg-ink hover:text-paper"}`}>
                {k}
              </button>
            ))}
          </div>

          <ol className="mt-8 border-t border-ink" onMouseLeave={() => setHi(null)}>
            {lessons.map((t, i) => (
              <li key={t} className="kl-item">
                <button onMouseEnter={() => setHi(i)} onFocus={() => setHi(i)}
                  className={`w-full grid grid-cols-[3.2rem_1fr_auto] items-baseline py-3.5 border-b border-ink text-left transition-colors ${hi === i ? "text-blue" : ""}`}>
                  <span className="lbl tnum">Bab {String(i + 1).padStart(2, "0")}</span>
                  <span className="cmp text-3xl md:text-4xl">{t}</span>
                  <span className={`lbl transition-opacity ${hi === i ? "opacity-100" : "opacity-0"}`}>Mulai</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-6 flex items-center">
          <div ref={grid} className="relative w-full aspect-square grid grid-cols-6 grid-rows-6" aria-hidden>
            {/* faint grid */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(20,20,20,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,20,20,.08)_1px,transparent_1px)] bg-[size:calc(100%/6)_calc(100%/6)]" />
            {cells.map(([c, r], i) => (
              <div key={`${level}-${i}`} className="sq handles text-ink relative" style={{ gridColumn: c + 1, gridRow: r + 1 }}
                onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)}>
                <i className="h !w-[6px] !h-[6px]" /><i className="h !w-[6px] !h-[6px]" /><i className="h !w-[6px] !h-[6px]" /><i className="h !w-[6px] !h-[6px]" />
                <div className={`absolute inset-0 border border-ink transition-transform duration-300 ${FILLS[(i + STEP[level]) % FILLS.length]} ${hi === i ? "-translate-y-2 shadow-[0_14px_0_-6px_#141414]" : ""}`}>
                  <span className={`absolute left-2 top-1 cmp text-[clamp(1.4rem,3vw,2.6rem)] ${FILLS[(i + STEP[level]) % FILLS.length].includes("checker") ? "text-ink bg-paper px-1" : "text-white"}`}>{String(i + 1).padStart(2, "0")}</span>
                </div>
              </div>
            ))}
            <span className="absolute right-0 bottom-0 lbl text-right">{level}<br />{lessons.length} bab</span>
          </div>
        </div>
      </div>
    </section>
  );
}
