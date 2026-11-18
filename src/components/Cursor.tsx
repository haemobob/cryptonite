"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Small blue dot that follows the pointer. Over anything with data-cursor="Label"
 * it opens into a disc carrying that label. Mouse/trackpad only.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    document.body.classList.add("has-cursor");
    const xTo = gsap.quickTo(dot.current, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(dot.current, "y", { duration: 0.35, ease: "power3.out" });
    const last = { x: -1, y: -1 };
    const read = (target: Element | null) => {
      const t = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(t ? t.dataset.cursor || "" : null);
      setDark(!!target?.closest("[data-cursor-dark]"));
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setOn(true);
      last.x = e.clientX; last.y = e.clientY;
      xTo(e.clientX); yTo(e.clientY);
      read(e.target as Element);
    };
    // content moves under a still pointer while scrolling: re-read what is beneath it
    const scroll = () => { if (last.x >= 0) read(document.elementFromPoint(last.x, last.y)); };
    const out = () => setOn(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("pointerleave", out);
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("pointerleave", out);
    };
  }, []);

  const open = label !== null;
  return (
    <div ref={dot} className="fixed left-0 top-0 z-[100] pointer-events-none hidden [@media(hover:hover)_and_(pointer:fine)]:block" aria-hidden>
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full grid place-items-center transition-[width,height,opacity,background-color] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${on ? "opacity-100" : "opacity-0"} ${dark ? "bg-white text-blue" : "bg-blue text-white"}`}
        style={{ width: open ? 92 : 12, height: open ? 92 : 12 }}
      >
        <span className={`lbl transition-opacity duration-200 ${open && label ? "opacity-100" : "opacity-0"}`}>{label}</span>
      </div>
    </div>
  );
}
