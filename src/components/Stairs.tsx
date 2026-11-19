"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The one transition between colour sections: steps of the next section's colour
 * rise out of the bottom of the current one as it scrolls away.
 */
export default function Stairs({ to, className = "" }: { to: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const steps = root.current!.querySelectorAll(".stair");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { gsap.set(steps, { scaleY: 1 }); return; }
    const tw = gsap.fromTo(steps, { scaleY: 0 }, {
      scaleY: 1, ease: "none", stagger: 0.06,
      scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom 65%", scrub: true },
    });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, []);
  return (
    <div ref={root} className={`h-[16vh] flex items-end ${className}`} aria-hidden>
      {[0.2, 0.35, 0.5, 0.62, 0.74, 0.86, 1].map((h, i) => (
        <div key={i} className="stair flex-1 origin-bottom" style={{ height: `${h * 100}%`, background: to }} />
      ))}
    </div>
  );
}
