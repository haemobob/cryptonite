"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { M, POSTS, SOCIALS } from "@/lib/data";
import { FbIcon, IgIcon, ThreadsIcon } from "./Icons";

const FAN = [
  { x: -118, r: -11 }, { x: -38, r: -3.5 }, { x: 40, r: 4 }, { x: 120, r: 11 },
];

export default function Social() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const isWide = window.innerWidth >= 768;
      const k = isWide ? 1 : 0.55;
      // the stack fans open as it scrolls into view
      gsap.utils.toArray<HTMLElement>(".post").forEach((el, i) => {
        gsap.fromTo(el, { xPercent: 0, rotate: (i - 1.5) * 2, y: 40 }, {
          xPercent: FAN[i].x * k, rotate: FAN[i].r, y: Math.abs(i - 1.5) * 26, ease: "none",
          scrollTrigger: { trigger: ".fan", start: "top 85%", end: "center 45%", scrub: 0.6 },
        });
      });
      gsap.from(".so-ln", { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.08, scrollTrigger: { trigger: ".so-head", start: "top 80%" } });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.utils.toArray<HTMLElement>(".post").forEach((el, i) => gsap.set(el, { xPercent: FAN[i].x * 0.55, rotate: FAN[i].r }));
    });
    return () => mm.revert();
  }, []);

  const tiles = [
    { name: "Instagram", handle: "@cryptoniteid", href: SOCIALS.instagram, Icon: IgIcon },
    { name: "Threads", handle: "@cryptoniteid", href: SOCIALS.threads, Icon: ThreadsIcon },
    { name: "Facebook", handle: "Cryptonite ID", href: SOCIALS.facebook, Icon: FbIcon },
  ];

  return (
    <section ref={root} className="bg-black text-paper pt-24 md:pt-36 pb-20 overflow-hidden">
      <h2 className="so-head cmp text-center text-[17vw] md:text-[9vw] px-4">
        <span className="mask"><span className="ln so-ln">Ada di timeline</span></span>
        <span className="mask"><span className="ln so-ln"><span className="text-sky">Anda,</span> setiap hari.</span></span>
      </h2>

      <div className="fan relative h-[440px] md:h-[620px] mt-14 flex justify-center">
        {POSTS.map((p, i) => (
          <a key={p.cover} href={SOCIALS.instagram} target="_blank" rel="noreferrer" data-cursor="Buka"
            className="post absolute top-0 w-[46vw] max-w-[320px] md:w-[23vw] aspect-[4/5] bg-black border border-paper/25 overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)] hover:!z-20 hover:-translate-y-3 transition-transform duration-300"
            style={{ zIndex: 10 - Math.abs(i - 1.5) * 2 }}>
            <img src={M(p.img)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <span className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <img src="/logo-alpha.png" alt="" className="absolute left-3 top-3 h-3 md:h-[14px] w-auto" />
            <span className="absolute right-3 top-3 lbl bg-paper text-black px-1.5 py-0.5">{p.kind}</span>
            <span className="absolute left-3 right-3 bottom-4 cmp text-[9vw] md:text-[3vw] leading-[0.88] text-white">
              <span className="bg-blue box-decoration-clone px-1.5">{p.cover}</span>
            </span>
          </a>
        ))}
      </div>

      <div className="px-4 md:px-8 mt-10 grid sm:grid-cols-3 border-t border-l border-paper/30">
        {tiles.map(({ name, handle, href, Icon }) => (
          <a key={name} href={href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 p-6 md:p-8 border-r border-b border-paper/30 hover:bg-blue transition-colors">
            <span>
              <span className="block cmp text-5xl md:text-6xl">{name}</span>
              <span className="lbl text-paper/70 group-hover:text-white">{handle}</span>
            </span>
            <Icon className="w-9 h-9 shrink-0 group-hover:rotate-[-8deg] transition-transform" />
          </a>
        ))}
      </div>
    </section>
  );
}
