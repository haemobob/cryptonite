"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RADAR } from "@/lib/data";

export default function SocialRadar() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) { gsap.set(".bar-fill", { scaleX: 1 }); return; }
      gsap.fromTo(".bar-fill", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: ".radar-list", start: "top 78%" } });
      gsap.from(".radar-head .line", { yPercent: 105, duration: 1, ease: "power4.out", stagger: 0.1, scrollTrigger: { trigger: ".radar-head", start: "top 80%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  const a = RADAR[active];
  return (
    <section id="sosial" ref={root} className="bg-ink text-paper px-4 md:px-8 py-20 md:py-32">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <h2 className="radar-head display text-7xl md:text-[9rem]">
            <span className="mask"><span className="line">Radar</span></span>
            <span className="mask"><span className="line text-sky">sosial</span></span>
          </h2>
          <p className="mt-8 text-lg leading-snug max-w-md text-paper/80">
            Narasi lahir di timeline sebelum masuk grafik. Kami memantau Instagram, Threads, dan X, lalu memilah sinyal dari kebisingan.
          </p>
          <div className="mt-10 border-t-2 border-sky pt-5 min-h-36" aria-live="polite">
            <p className="text-sm font-bold text-paper/60">Sedang dipilih</p>
            <p className="display-wide text-3xl md:text-4xl mt-1">{a.topic}</p>
            <p className="mt-2 tnum text-lg">Intensitas {a.heat}/100 · <span className={a.shift.startsWith("-") ? "text-down" : "text-sky"}>{a.shift}</span> dibanding kemarin</p>
          </div>
        </div>

        <ul className="radar-list lg:col-span-7 flex flex-col">
          {RADAR.map((r, i) => (
            <li key={r.topic}>
              <button
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`w-full text-left py-5 border-b border-paper/15 group transition-colors ${i === active ? "text-sky" : "hover:text-paper"}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="display-wide text-xl md:text-3xl">{r.topic}</span>
                  <span className="tnum text-sm font-bold shrink-0">{r.shift}</span>
                </div>
                <div className="mt-3 h-1.5 bg-paper/10">
                  <div className="bar-fill h-full origin-left" style={{ width: `${r.heat}%`, background: i === active ? "var(--sky)" : "rgba(245,245,242,0.55)", transition: "background .25s" }} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-10 text-xs text-paper/45">Data ilustrasi untuk desain. Sambungkan ke sumber data sebenarnya sebelum rilis.</p>
    </section>
  );
}
