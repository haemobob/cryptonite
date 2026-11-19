"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Shared entrance motion, so every section enters the same way:
 * - section titles rise out of their mask
 * - media marked data-reveal wipes in from the bottom in hard steps
 */
export default function Reveals() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tweens: gsap.core.Tween[] = [];
    gsap.utils.toArray<HTMLElement>(".sec-head .ln").forEach((el) => {
      tweens.push(gsap.from(el, { yPercent: 110, duration: 1, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }));
    });
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      tweens.push(gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "steps(7)",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }));
    });
    return () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
  }, []);
  return null;
}
