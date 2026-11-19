"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Ticker from "./Ticker";
import type { PlanetApi } from "./Planet";

const Planet = dynamic(() => import("./Planet"), { ssr: false });

const BASE = 860, THIN = 240, RADIUS = 300;

function Chars({ text }: { text: string }) {
  return <>{[...text].map((c, i) => <span key={i} className="hc inline-block" style={{ fontVariationSettings: `"wght" ${BASE}` }}>{c}</span>)}</>;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const planet = useRef<PlanetApi | null>(null);
  const progress = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current!;
    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      // scroll progress drives the 3D scene
      const lenis = () => (window as unknown as { __lenis?: { scrollTo: (t: number, o: object) => void } }).__lenis;
      const jumping = () => (window as unknown as { __navJump?: boolean }).__navJump;
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      let auto = false;
      let input: "wheel" | "touch" = "wheel";
      let lastDir = 1;
      let cancelGlide: (() => void) | null = null;
      const range = () => el.offsetHeight - window.innerHeight;
      const diveEnd = () => el.offsetTop + el.offsetHeight;          // the next section itself
      const rewindTo = () => el.offsetTop + range() * 0.32;          // back to the planet

      // wheel / trackpad: Lenis glides there and ignores further wheel input meanwhile
      const lenisGlide = (to: number, duration: number) => {
        const l = lenis(); if (!l) return;
        auto = true;
        l.scrollTo(to, { duration, easing: ease, lock: true, onComplete: () => { auto = false; } });
      };
      // touch: runs after the finger lifts; freezing overflow kills native momentum so nothing fights it,
      // and touching the screen again hands control straight back
      const touchGlide = (to: number, duration: number) => {
        const root = document.documentElement;
        const from = window.scrollY, t0 = performance.now();
        let raf = 0;
        auto = true;
        root.style.overflow = "hidden";
        const done = () => { cancelAnimationFrame(raf); root.style.overflow = ""; auto = false; cancelGlide = null; };
        const step = (now: number) => {
          const k = Math.min(1, (now - t0) / (duration * 1000));
          window.scrollTo(0, from + (to - from) * ease(k));
          if (k < 1) raf = requestAnimationFrame(step); else done();
        };
        raf = requestAnimationFrame(step);
        cancelGlide = done;
      };

      const inDive = () => { const y = window.scrollY - el.offsetTop; return y > range() * 0.4 && y < range() * 0.995; };
      const inRewind = () => { const y = window.scrollY - el.offsetTop; return y > range() * 0.4 && y < el.offsetHeight - 8; };

      ScrollTrigger.create({
        trigger: el, start: "top top", end: "bottom bottom",
        onUpdate: (self) => {
          progress.current = self.progress;
          planet.current?.setProgress(self.progress);
          lastDir = self.direction;
          if (auto || jumping() || input === "touch") return;
          if (self.direction === 1 && inDive()) lenisGlide(diveEnd(), 2.6);
        },
      });
      // scrolling back up from the next section: rewind straight to the planet.
      // tracked over the whole section so it fires before you reach the pinned part
      ScrollTrigger.create({
        trigger: el, start: "top top", end: "bottom top",
        onUpdate: (self) => {
          lastDir = self.direction;
          if (auto || jumping() || input === "touch" || self.direction !== -1) return;
          if (inRewind()) lenisGlide(rewindTo(), 2.2);
        },
      });

      const onWheel = () => { input = "wheel"; };
      const onTouchStart = () => { input = "touch"; cancelGlide?.(); };
      const onTouchEnd = () => {
        if (auto || jumping()) return;
        if (lastDir === 1 && inDive()) touchGlide(diveEnd(), 1.9);
        else if (lastDir === -1 && inRewind()) touchGlide(rewindTo(), 1.7);
      };
      window.addEventListener("wheel", onWheel, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });
      cleanups.push(() => {
        cancelGlide?.();
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("touchcancel", onTouchEnd);
      });
      if (reduce) return;
      gsap.from(".planet-wrap", { opacity: 0, duration: 0.9, ease: "power1.out" });

      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 } });
      tl.to(".hero-in", { opacity: 0, y: -24, duration: 0.12 }, 0)
        .to(".wm", { yPercent: -60, opacity: 0, letterSpacing: "0.06em", duration: 0.45, ease: "power2.in" }, 0.02)
        .to(".hero-blue", { opacity: 1, duration: 0.08 }, 0.8)
        .fromTo(".hero-stair", { scaleY: 0 }, { scaleY: 1, duration: 0.12, stagger: 0.012, ease: "power2.inOut" }, 0.87);
    }, el);

    // letters thin out around the cursor
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!reduce && fine) {
      const chars = gsap.utils.toArray<HTMLElement>(".hc", el);
      const w = chars.map(() => BASE);
      let centers: { x: number; y: number }[] = [];
      const measure = () => { centers = chars.map((c) => { const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); };
      const mouse = { x: -9999, y: -9999 };
      const move = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
      const leave = () => { mouse.x = -9999; };
      let frame = 0;
      const tick = () => {
        if (progress.current > 0.4) return;
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

  return (
    <section ref={root} className="relative bg-black h-[260vh] supports-[height:100lvh]:h-[260lvh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden text-paper">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,#001a5c_0%,#000614_45%,#000_75%)]" />

        {/* wordmark sits behind the planet, which rises over it */}
        <h1 className="wm z-0 cmp absolute inset-x-0 top-[17vh] md:top-[13vh] text-center whitespace-nowrap text-[21vw] md:text-[18.5vw] leading-[0.8] pointer-events-none" aria-label="Cryptonite">
          <span className="inline-flex overflow-hidden pb-[0.05em]" aria-hidden><Chars text="CRYPTONITE" /></span>
        </h1>

        <div className="planet-wrap absolute inset-0 z-[1]">
          <Planet onReady={(api) => { planet.current = api; api.setProgress(progress.current); }} />
        </div>

        <div className="absolute z-[2] inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/85 to-transparent pointer-events-none" />
        <div className="absolute z-[2] inset-x-0 bottom-[52px] px-4 md:px-8 pb-5 flex flex-wrap items-end justify-between gap-6 pointer-events-none">
          <p className="hero-in max-w-[30rem] text-lg md:text-2xl leading-[1.15] font-semibold">
            Media kripto Indonesia. Edukasi, analisis, berita, dan kabar sosial yang sedang ramai di timeline Anda.
          </p>
          <p className="hero-in lbl flex items-center gap-3">Gulir untuk mendarat <span className="block w-px h-10 bg-paper/60 animate-pulse" /></p>
        </div>
        <div className="hero-in absolute z-[2] inset-x-0 bottom-0 bg-black/80"><Ticker /></div>

        <div className="hero-blue z-[3] absolute inset-0 bg-blue opacity-0 pointer-events-none" />
        <div className="absolute z-[4] inset-0 flex items-end pointer-events-none" aria-hidden>
          {Array.from({ length: 7 }).map((_, i) => <div key={i} className="hero-stair flex-1 -mr-px h-full bg-paper origin-bottom" style={{ transform: "scaleY(0)" }} />)}
        </div>

      </div>
    </section>
  );
}
