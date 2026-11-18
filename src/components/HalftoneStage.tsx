"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const vert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const frag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform float uAspA;
uniform float uAspB;
uniform float uMix;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uHover;
uniform float uTime;
uniform float uCell;
uniform float uDim;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec2 cover(vec2 uv, float imgAsp) {
  float scr = uRes.x / uRes.y;
  vec2 s = scr > imgAsp ? vec2(1.0, imgAsp / scr) : vec2(scr / imgAsp, 1.0);
  float z = 0.93 + 0.025 * sin(uTime * 0.12);
  return (uv - 0.5) * s * z + 0.5;
}

vec3 pick(vec2 uv, vec2 cell) {
  vec3 a = texture2D(uA, cover(uv, uAspA)).rgb;
  vec3 b = texture2D(uB, cover(uv, uAspB)).rgb;
  // stepped dissolve: cells flip in a rough top-down staircase
  float rows = uRes.y / uCell;
  float t = hash(cell) * 0.55 + (1.0 - cell.y / rows) * 0.45;
  return mix(a, b, step(t, uMix));
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 cell = floor(px / uCell);
  vec2 center = (cell + 0.5) * uCell;
  vec3 col = pick(center / uRes, cell);
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  lum = pow(smoothstep(0.02, 0.78, lum), 0.8);

  float rad = (0.12 + sqrt(lum) * 0.6) * uCell;
  float d = length(px - center);
  float dotm = 1.0 - smoothstep(rad - 0.9, rad + 0.6, d);

  vec3 deep = vec3(0.0, 0.16, 0.55);
  vec3 blue = vec3(0.0, 0.314, 0.941);
  vec3 hi = vec3(0.86, 0.92, 1.0);
  vec3 tint = lum < 0.55 ? mix(deep, blue, lum / 0.55) : mix(blue, hi, (lum - 0.55) / 0.45);
  vec3 tone = mix(vec3(0.0), tint, dotm);

  // cursor lens: the real photograph shows through
  vec3 real = pick(px / uRes, cell);
  float m = length(px - uMouse);
  float lens = (1.0 - smoothstep(uRes.y * 0.13, uRes.y * 0.24, m)) * uHover;
  vec3 outc = mix(tone, real, lens);

  gl_FragColor = vec4(outc * (1.0 - uDim), 1.0);
}
`;

export default function HalftoneStage({ images, index, dim = 0 }: { images: string[]; index: number; dim?: number }) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ show: (i: number) => void; setDim: (v: number) => void } | null>(null);

  useEffect(() => {
    const el = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    } catch {
      const img = document.createElement("img");
      img.src = images[index]; img.alt = "";
      img.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.2)";
      el.appendChild(img);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    const loader = new THREE.TextureLoader();
    const tex: (THREE.Texture | null)[] = images.map(() => null);
    const asp: number[] = images.map(() => 1.5);
    const load = (i: number) =>
      new Promise<THREE.Texture>((res) => {
        if (tex[i]) return res(tex[i]!);
        loader.load(images[i], (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.minFilter = THREE.LinearFilter;
          t.generateMipmaps = false;
          const img = t.image as HTMLImageElement;
          asp[i] = img.width / img.height;
          tex[i] = t;
          res(t);
        });
      });

    const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
    blank.needsUpdate = true;
    const u = {
      uA: { value: blank as THREE.Texture }, uB: { value: blank as THREE.Texture },
      uAspA: { value: 1.5 }, uAspB: { value: 1.5 }, uMix: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uHover: { value: 0 }, uTime: { value: 0 }, uCell: { value: 7 * dpr }, uDim: { value: dim },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: u });
    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    const cam = new THREE.Camera();

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      u.uRes.value.set(w * dpr, h * dpr);
      u.uCell.value = (w < 700 ? 6 : 7) * dpr;
      if (reduce) renderer.render(scene, cam);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // pointer lens, eased
    const target = { x: -9999, y: -9999 };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = (e.clientX - r.left) * dpr;
      target.y = (r.height - (e.clientY - r.top)) * dpr;
      if (u.uMouse.value.x < -999) u.uMouse.value.set(target.x, target.y);
    };
    const enter = (e: PointerEvent) => { if (e.pointerType === "mouse") gsap.to(u.uHover, { value: 1, duration: 0.6, ease: "power2.out" }); };
    const leave = () => gsap.to(u.uHover, { value: 0, duration: 0.6, ease: "power2.out" });
    const zone = el.parentElement!;
    zone.addEventListener("pointermove", move);
    zone.addEventListener("pointerenter", enter);
    zone.addEventListener("pointerleave", leave);

    let current = -1;
    let busy: gsap.core.Tween | null = null;
    const show = async (i: number) => {
      if (i === current) return;
      const t = await load(i);
      if (current === -1) {
        u.uA.value = t; u.uAspA.value = asp[i]; current = i;
        if (reduce) renderer.render(scene, cam);
        return;
      }
      busy?.progress(1);
      u.uB.value = t; u.uAspB.value = asp[i]; u.uMix.value = 0;
      current = i;
      busy = gsap.to(u.uMix, {
        value: 1, duration: reduce ? 0 : 1.15, ease: "power2.inOut",
        onComplete: () => { u.uA.value = t; u.uAspA.value = asp[i]; u.uMix.value = 0; if (reduce) renderer.render(scene, cam); },
      });
    };
    api.current = { show, setDim: (v) => { u.uDim.value = v; } };
    show(index);
    images.forEach((_, i) => i !== index && load(i));

    // render only while visible
    let visible = true;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(el);
    const tick = (time: number) => {
      if (!visible || reduce) return;
      u.uTime.value = time;
      u.uMouse.value.x += (target.x - u.uMouse.value.x) * 0.14;
      u.uMouse.value.y += (target.y - u.uMouse.value.y) * 0.14;
      renderer.render(scene, cam);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect(); ro.disconnect();
      zone.removeEventListener("pointermove", move);
      zone.removeEventListener("pointerenter", enter);
      zone.removeEventListener("pointerleave", leave);
      tex.forEach((t) => t?.dispose());
      mat.dispose(); renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
    };
    // images are static for the page lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { api.current?.show(index); }, [index]);
  useEffect(() => { api.current?.setDim(dim); }, [dim]);

  return (
    <div ref={host} className="absolute inset-0 bg-black">
      {/* no-WebGL fallback: plain halftone-styled photo */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[index]} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </noscript>
    </div>
  );
}
