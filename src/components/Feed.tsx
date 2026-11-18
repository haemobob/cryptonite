"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FEED, SOCIALS } from "@/lib/data";

function Card({ c }: { c: (typeof FEED)[number] }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateY: x * 10, rotateX: -y * 10, transformPerspective: 900, duration: 0.4, ease: "power2.out" });
  };
  const leave = () => gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
  const dark = c.hue === "#000000" || c.hue === "#0050f0";
  return (
    <a ref={ref} href={SOCIALS.instagram} target="_blank" rel="noreferrer" onPointerMove={move} onPointerLeave={leave}
      className="feed-card shrink-0 w-[72vw] sm:w-[320px] aspect-[4/5] p-5 flex flex-col justify-between border-2 border-ink"
      style={{ background: c.hue, color: dark ? "#f5f5f2" : "#0a0a0a" }}>
      <span className="text-xs font-bold">{c.kind}</span>
      <h3 className="display-wide text-2xl md:text-3xl">{c.title}</h3>
      <span className="text-sm font-semibold tnum">♥ {c.likes}</span>
    </a>
  );
}

export default function Feed() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // the rail drifts sideways with scroll — no pinning, just a nudge
      gsap.fromTo(".feed-rail", { x: 60 }, { x: -120, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="feed" ref={root} className="bg-paper py-20 md:py-28 overflow-hidden">
      <div className="px-4 md:px-8 flex flex-wrap items-end justify-between gap-6 mb-10">
        <h2 className="display text-7xl md:text-[9rem]">Di sosmed</h2>
        <div className="flex gap-3 text-sm font-bold">
          {([["Instagram", SOCIALS.instagram], ["Facebook", SOCIALS.facebook], ["Threads", SOCIALS.threads]] as const).map(([n, h]) => (
            <a key={n} href={h} target="_blank" rel="noreferrer" className="border-2 border-ink px-4 py-2 hover:bg-ink hover:text-sky transition-colors">{n}</a>
          ))}
        </div>
      </div>
      <div className="feed-rail flex gap-4 px-4 md:px-8 w-max">
        {FEED.map((c) => <Card key={c.title} c={c} />)}
      </div>
    </section>
  );
}
