"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Gem from "./Gem";
import Ticker from "./Ticker";
import { SM, WALL } from "@/lib/data";

const COLS = 7;
const BASE = 860, THIN = 240, RADIUS = 280;

function Chars({ text }: { text: string }) {
  return <>{[...text].map((c, i) => <span key={i} className="hc inline-block" style={{ fontVariationSettings: `"wght" ${BASE}` }}>{c}</span>)}</>;
}

function Cover({ s }: { s: (typeof WALL)[number] }) {
  return (
    <a href="#liputan" data-cursor="Baca" className="group relative block aspect-[4/5] overflow-hidden bg-black">
      <div className="ht absolute inset-0"><img src={SM(s.img)} alt="" className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.06]" loading="lazy" decoding="async" /></div>
      <span className="absolute left-2.5 top-2.5 lbl !text-[12px] bg-paper text-ink px-1.5 py-0.5">{s.tag}</span>
      <span className="absolute inset-x-2.5 bottom-3 cmp text-[clamp(1.1rem,1.75vw,1.9rem)] leading-[0.92] text-white">
        <span className="bg-blue box-decoration-clone px-1">{s.title}</span>
      </span>
    </a>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current!;
    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      // timeline columns drift in alternating directions
      const loops = gsap.utils.toArray<HTMLElement>(".wcol-inner").map((c, i) => {
        const up = i % 2 === 0;
        return gsap.fromTo(c, { yPercent: up ? 0 : -50 }, { yPercent: up ? -50 : 0, duration: 46 + (i % 3) * 9, ease: "none", repeat: -1 });
      });
      if (reduce) { loops.forEach((l) => l.pause()); gsap.set(".intro-step", { display: "none" }); return; }

      // entrance
      gsap.timeline({ delay: 0.1 })
        .to(".intro-step", { yPercent: -101, duration: 0.9, ease: "power4.inOut", stagger: { each: 0.06, from: "end" } })
        .from(".wcol", { yPercent: 30, opacity: 0, duration: 1.4, ease: "power3.out", stagger: { each: 0.06, from: "center" } }, "-=0.6")
        .from(".mk-ch .hc", { yPercent: 115, duration: 1, ease: "power4.out", stagger: 0.04 }, "-=1.2")
        .from(".mk-gem", { scale: 0, rotate: -220, duration: 1.2, ease: "back.out(1.4)" }, "-=0.9")
        .from(".hero-in", { opacity: 0, y: 16, duration: 0.7, ease: "power2.out", stagger: 0.08 }, "-=0.7");

      // the dive: scroll pulls the camera into the gem
      const gemCenter = () => {
        const h = el.querySelector<HTMLElement>(".mk")!.getBoundingClientRect();
        const g = el.querySelector<HTMLElement>(".mk-gem")!.getBoundingClientRect();
        return `${g.left + g.width / 2 - h.left}px ${g.top + g.height / 2 - h.top}px`;
      };
      const zoom = () => {
        const g = el.querySelector<HTMLElement>(".mk-gem")!.getBoundingClientRect();
        return (Math.hypot(window.innerWidth, window.innerHeight) / g.width) * 1.25;
      };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
      });
      tl.to(".hero-in", { opacity: 0, y: -20, duration: 0.1 }, 0)
        .to(".mk-l", { xPercent: -40, duration: 0.5, ease: "power2.in" }, 0.05)
        .to(".mk-r", { xPercent: 40, duration: 0.5, ease: "power2.in" }, 0.05)
        .fromTo(".mk", { scale: 1, transformOrigin: gemCenter }, { scale: zoom, transformOrigin: gemCenter, duration: 0.75, ease: "power3.in" }, 0.08)
        .to(".mk-gem", { rotate: 90, duration: 0.75, ease: "power1.in" }, 0.08)
        .to(".wall", { scale: 1.35, opacity: 0.25, duration: 0.7, ease: "power2.in" }, 0.05)
        .set(".wall", { pointerEvents: "none" }, 0.6)
        .to(".hero-blue", { opacity: 1, duration: 0.08 }, 0.78)
        .fromTo(".hero-stair", { scaleY: 0 }, { scaleY: 1, duration: 0.14, stagger: 0.012, ease: "power2.inOut" }, 0.86);

      // scroll speed nudges the columns
      const st = ScrollTrigger.create({
        trigger: el, start: "top top", end: "bottom top",
        onUpdate: (self) => {
          const v = 1 + Math.min(4, Math.abs(self.getVelocity()) / 400);
          loops.forEach((l) => gsap.to(l, { timeScale: v, duration: 0.2, overwrite: true, onComplete: () => { gsap.to(l, { timeScale: 1, duration: 1.2 }); } }));
        },
      });
      cleanups.push(() => st.kill());
    }, el);

    // pointer: wall drifts against the cursor, letters thin out near it
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!reduce && fine) {
      const wx = gsap.quickTo(".wall-par", "x", { duration: 1.2, ease: "power3.out" });
      const wy = gsap.quickTo(".wall-par", "y", { duration: 1.2, ease: "power3.out" });
      const chars = gsap.utils.toArray<HTMLElement>(".hc", el);
      const w = chars.map(() => BASE);
      let centers: { x: number; y: number }[] = [];
      const measure = () => { centers = chars.map((c) => { const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); };
      const mouse = { x: -9999, y: -9999 };
      const move = (e: PointerEvent) => {
        mouse.x = e.clientX; mouse.y = e.clientY;
        wx((e.clientX / window.innerWidth - 0.5) * -60); wy((e.clientY / window.innerHeight - 0.5) * -40);
      };
      const leave = () => { mouse.x = -9999; };
      let frame = 0;
      const tick = () => {
        if (++frame % 15 === 0) measure();
        chars.forEach((c, i) => {
          const d = centers[i] ? Math.hypot(mouse.x - centers[i].x, mouse.y - centers[i].y) : 9999;
          const k = Math.max(0, 1 - d / RADIUS);
          w[i] += (BASE - (BASE - THIN) * k * k - w[i]) * 0.15;
          c.style.fontVariationSettings = `"wght" ${w[i].toFixed(0)}`;
        });
      };
      measure();
      gsap.ticker.add(tick);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => { gsap.ticker.remove(tick); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
    }
    return () => { ctx.revert(); cleanups.forEach((f) => f()); };
  }, []);

  const cols = Array.from({ length: COLS }, (_, c) => Array.from({ length: 6 }, (_, r) => WALL[(c * 4 + r * 3) % WALL.length]));

  return (
    <section ref={root} className="relative bg-black h-[280vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden text-paper">
        {/* the timeline wall */}
        <div className="wall absolute inset-0 will-change-transform">
          <div className="wall-par absolute -inset-[22%] rotate-[-9deg]">
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4 h-full px-3">
              {cols.map((col, c) => (
                <div key={c} className={`wcol relative overflow-hidden ${c >= 5 ? "hidden lg:block" : c >= 3 ? "hidden md:block" : ""}`}>
                  <div className="wcol-inner flex flex-col gap-3 md:gap-4">
                    {[...col, ...col].map((s, i) => <Cover key={i} s={s} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.72)_0%,rgba(0,0,0,.25)_55%,transparent_80%)] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black via-black/75 to-transparent pointer-events-none" />

        {/* the wordmark, with the gem as its O */}
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <h1 className="mk cmp flex items-center whitespace-nowrap text-[19vw] md:text-[17vw] will-change-transform" aria-label="Cryptonite">
            <span className="mk-l mk-ch inline-flex overflow-hidden pb-[0.04em]" aria-hidden><Chars text="CRYPT" /></span>
            <span className="mk-gem inline-block w-[0.66em] h-[0.66em] mx-[0.03em] translate-y-[-0.02em] drop-shadow-[0_0_40px_rgba(47,143,255,.45)]" aria-hidden><Gem className="w-full h-full" /></span>
            <span className="mk-r mk-ch inline-flex overflow-hidden pb-[0.04em]" aria-hidden><Chars text="NITE" /></span>
          </h1>
        </div>

        <div className="absolute inset-x-0 bottom-[52px] px-4 md:px-8 pb-5 flex flex-wrap items-end justify-between gap-6 pointer-events-none">
          <p className="hero-in max-w-[30rem] text-lg md:text-2xl leading-[1.15] font-semibold">
            Media kripto Indonesia. Edukasi, analisis, berita, dan kabar sosial yang sedang ramai di timeline Anda.
          </p>
          <p className="hero-in lbl flex items-center gap-3">Gulir untuk masuk <span className="block w-px h-10 bg-paper/60 origin-top animate-pulse" /></p>
        </div>
        <div className="hero-in absolute inset-x-0 bottom-0 bg-black"><Ticker /></div>

        <div className="hero-blue absolute inset-0 bg-blue opacity-0 pointer-events-none" />
        <div className="absolute inset-0 flex items-end pointer-events-none" aria-hidden>
          {Array.from({ length: 7 }).map((_, i) => <div key={i} className="hero-stair flex-1 h-full bg-paper origin-bottom" style={{ transform: "scaleY(0)" }} />)}
        </div>

        <div className="absolute inset-0 z-[90] flex pointer-events-none" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className={`intro-step flex-1 h-full ${i % 2 ? "bg-blue" : "bg-paper"}`} />)}
        </div>
      </div>
    </section>
  );
}
