"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    const root = document.documentElement;
    let skew = 0;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => {
      lenis.raf(t * 1000);
      // media leans into fast scrolls and settles when you stop
      const target = gsap.utils.clamp(-5, 5, lenis.velocity * 0.12);
      skew += (target - skew) * 0.12;
      root.style.setProperty("--skew", `${skew.toFixed(3)}deg`);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
