"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/*
  Planet "Krypton": a crystalline blue planet rising from the bottom of the hero.
  - surface: 3D Voronoi facets that glint as the planet turns; on the night side
    the facet edges and cell "nodes" glow like a network
  - atmosphere: additive fresnel shell
  - crescent: thousands of shimmering points orbiting the lit limb
  - stars: a faint twinkling field
  Scroll progress (0..1) is pushed in from the hero: the sun swings round,
  the planet rises and spins up, the crescent bursts outward, the camera dives.
*/

export type PlanetApi = { setProgress: (p: number) => void };

const noise = /* glsl */ `
vec3 hash3(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453123);
}
// returns: x = distance to nearest cell point, y = edge distance (f2 - f1), z = cell id; cp = nearest feature point
vec3 cp;
vec3 voronoi(vec3 x) {
  vec3 n = floor(x), f = fract(x);
  float f1 = 8.0, f2 = 8.0; vec3 id = vec3(0.0);
  for (int k = -1; k <= 1; k++)
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec3 g = vec3(float(i), float(j), float(k));
    vec3 o = hash3(n + g);
    vec3 r = g + o - f;
    float d = dot(r, r);
    if (d < f1) { f2 = f1; f1 = d; id = n + g; cp = n + g + o; }
    else if (d < f2) { f2 = d; }
  }
  return vec3(sqrt(f1), sqrt(f2) - sqrt(f1), fract(sin(dot(id, vec3(7.13, 157.1, 113.7))) * 43758.5453));
}
float vnoise(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = hash3(i).x, b = hash3(i + vec3(1,0,0)).x, c = hash3(i + vec3(0,1,0)).x, d = hash3(i + vec3(1,1,0)).x;
  float e = hash3(i + vec3(0,0,1)).x, g = hash3(i + vec3(1,0,1)).x, h = hash3(i + vec3(0,1,1)).x, k = hash3(i + vec3(1,1,1)).x;
  return mix(mix(mix(a,b,f.x), mix(c,d,f.x), f.y), mix(mix(e,g,f.x), mix(h,k,f.x), f.y), f.z);
}
float fbm(vec3 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; } return s; }
`;

const planetVert = /* glsl */ `
uniform vec3 uLight;
varying vec3 vObj; varying vec3 vV; varying vec3 vL;
void main() {
  vObj = position;
  mat3 R = mat3(modelMatrix);
  // lighting happens in object space so each crystal can carry one flat normal
  vL = normalize(transpose(R) * uLight);
  vec3 camObj = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  vV = normalize(camObj - position);
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}`;

const planetFrag = /* glsl */ `
precision highp float;
uniform float uTime;
varying vec3 vObj; varying vec3 vV; varying vec3 vL;
${noise}
void main() {
  vec3 N = normalize(vObj), V = normalize(vV), L = normalize(vL);
  const float SC = 10.0;
  vec3 vo = voronoi(N * SC);
  float id = vo.z;
  // one flat normal per crystal: the cell's direction, tipped a little
  vec3 tilt = (hash3(vec3(id * 91.3, id * 17.1, id * 53.7)) - 0.5) * 0.6;
  vec3 Nf = normalize(normalize(cp / SC) + tilt);

  float land = smoothstep(0.32, 0.7, fbm(N * 2.2 + 3.1));
  vec3 navy = vec3(0.004, 0.018, 0.07), deep = vec3(0.0, 0.09, 0.38), blue = vec3(0.0, 0.31, 0.94);
  vec3 albedo = mix(navy, mix(deep, blue, id), land * 0.8 + id * 0.2);

  float ndl = dot(N, L);
  float day = smoothstep(-0.1, 0.3, ndl);
  float night = 1.0 - smoothstep(-0.3, 0.05, ndl);
  float diff = max(dot(Nf, L), 0.0) * day;
  float glint = pow(max(dot(reflect(-L, Nf), V), 0.0), 60.0) * day;

  float edge = 1.0 - smoothstep(0.0, 0.05, vo.y);
  float node = (1.0 - smoothstep(0.0, 0.09, vo.x)) * step(0.55, fract(id * 13.7));
  float pulse = 0.5 + 0.5 * sin(uTime * 2.4 + id * 60.0);
  // light packets travelling along the crystal veins on the night side
  float flow = smoothstep(0.92, 1.0, sin(dot(N, vec3(9.0, 4.0, 7.0)) * 3.0 - uTime * 1.6 + id * 6.0));
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);

  vec3 sky = vec3(0.18, 0.56, 1.0), ice = vec3(0.75, 0.9, 1.0);
  vec3 col = albedo * (0.025 + diff * 1.3);
  col += glint * mix(sky, ice, 0.55) * 1.7;
  col += edge * sky * (0.08 + 0.7 * day) * (0.55 + 0.45 * land);
  col += edge * sky * night * (0.16 + 0.7 * flow);
  col += node * ice * night * 1.5 * pulse;
  col += fres * sky * (0.2 + 1.5 * smoothstep(-0.3, 0.4, ndl));
  // filmic roll-off keeps sunlit crystals icy blue instead of clipping to white
  vec3 soft = vec3(1.0) - exp(-col * 1.3);
  col = mix(col, soft, smoothstep(vec3(0.55), vec3(1.3), col));
  gl_FragColor = vec4(col, 1.0);
}`;

const atmoVert = /* glsl */ `
varying vec3 vN; varying vec3 vView;
void main() {
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vView = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;
const atmoFrag = /* glsl */ `
uniform vec3 uLight;
varying vec3 vN; varying vec3 vView;
void main() {
  float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vView))), 2.6);
  float lit = 0.25 + 1.2 * smoothstep(-0.45, 0.5, dot(normalize(vN), normalize(uLight)));
  gl_FragColor = vec4(vec3(0.16, 0.5, 1.0) * rim * lit, rim * lit);
}`;

const ringVert = /* glsl */ `
attribute float aAngle; attribute float aRadius; attribute float aSpeed; attribute float aSize; attribute float aPhase; attribute float aTw; attribute float aZ;
uniform float uTime; uniform float uSpread; uniform float uPR; uniform vec2 uMouse; uniform float uHover; uniform float uR;
varying float vA; varying float vHot;
void main() {
  float th = aAngle + uTime * aSpeed;
  float r = uR * (aRadius + uSpread * (aRadius - 0.96) * 6.0 + uSpread * 0.25);
  vec3 pos = vec3(cos(th) * r, sin(th) * r, aZ);
  vec2 d = pos.xy - uMouse;
  float f = exp(-dot(d, d) * 6.0) * 0.32 * uHover;
  pos.xy += normalize(d + 1e-4) * f;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float tw = pow(0.5 + 0.5 * sin(uTime * aTw + aPhase), 3.0);
  vA = (0.25 + 0.75 * tw) * (1.0 - uSpread * 0.6);
  vHot = smoothstep(1.08, 1.0, aRadius) * tw;
  gl_PointSize = aSize * (0.55 + 0.9 * tw) * uPR * (6.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const ringFrag = /* glsl */ `
varying float vA; varying float vHot;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  vec3 c = mix(vec3(0.12, 0.45, 1.0), vec3(0.85, 0.94, 1.0), vHot);
  gl_FragColor = vec4(c, a * vA);
}`;

const starVert = /* glsl */ `
attribute float aPhase; attribute float aSize;
uniform float uTime; uniform float uPR;
varying float vA;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vA = 0.25 + 0.75 * pow(0.5 + 0.5 * sin(uTime * (0.6 + aPhase) + aPhase * 20.0), 4.0);
  gl_PointSize = aSize * uPR;
  gl_Position = projectionMatrix * mv;
}`;
const starFrag = /* glsl */ `
varying float vA;
void main() { float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(0.75, 0.85, 1.0), smoothstep(0.5, 0.0, d) * vA * 0.8); }`;

export default function Planet({ onReady }: { onReady?: (api: PlanetApi) => void }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      el.dataset.fallback = "1";
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    let dprCap = small ? 1.25 : 1.6;
    let dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const light = new THREE.Vector3(-0.85, 0.75, -0.75);
    const lightEnd = new THREE.Vector3(-0.45, 0.65, 0.85);
    const uLight = { value: light.clone() };
    const uTime = { value: 0 };

    // planet
    const world = new THREE.Group();
    scene.add(world);
    const planetMat = new THREE.ShaderMaterial({ vertexShader: planetVert, fragmentShader: planetFrag, uniforms: { uLight, uTime }, transparent: false });
    const planet = new THREE.Mesh(new THREE.SphereGeometry(1, small ? 96 : 144, small ? 72 : 108), planetMat);
    planet.rotation.z = 0.32;
    world.add(planet);
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.075, 96, 64),
      new THREE.ShaderMaterial({ vertexShader: atmoVert, fragmentShader: atmoFrag, uniforms: { uLight }, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide }),
    );
    world.add(atmo);

    // crescent of shimmering points, concentrated on the lit limb
    const N = small ? 4200 : 9000;
    const litAngle = Math.atan2(light.y, light.x);
    const attrs = { aAngle: new Float32Array(N), aRadius: new Float32Array(N), aSpeed: new Float32Array(N), aSize: new Float32Array(N), aPhase: new Float32Array(N), aTw: new Float32Array(N), aZ: new Float32Array(N) };
    for (let i = 0; i < N; i++) {
      // crescent: thick where the sun hits, thinning to points at both tips
      const spread = (Math.random() * 2 - 1) * 1.9;
      const taper = Math.pow(Math.cos((spread / 1.9) * Math.PI * 0.5), 1.6);
      const outer = Math.random() < 0.1;
      attrs.aAngle[i] = litAngle + spread;
      attrs.aRadius[i] = 1.006 + Math.pow(Math.random(), 2.2) * (outer ? 0.3 : 0.11) * taper + Math.random() * 0.004;
      attrs.aSpeed[i] = (0.03 + Math.random() * 0.05) * (Math.random() < 0.5 ? 1 : 0.6);
      attrs.aSize[i] = (outer ? 1.1 : 1.5) + Math.random() * 3.0 * taper;
      attrs.aPhase[i] = Math.random() * 6.283;
      attrs.aTw[i] = 0.8 + Math.random() * 3.2;
      attrs.aZ[i] = 0.02 + Math.random() * 0.04;
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    (Object.keys(attrs) as (keyof typeof attrs)[]).forEach((k) => ringGeo.setAttribute(k, new THREE.BufferAttribute(attrs[k], 1)));
    const ringU = { uTime, uSpread: { value: 0 }, uPR: { value: dpr }, uMouse: { value: new THREE.Vector2(99, 99) }, uHover: { value: 0 }, uR: { value: 1 } };
    const ring = new THREE.Points(ringGeo, new THREE.ShaderMaterial({ vertexShader: ringVert, fragmentShader: ringFrag, uniforms: ringU, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }));
    ring.frustumCulled = false;
    ring.renderOrder = 2;
    world.add(ring);

    // stars
    const S = small ? 500 : 1100;
    const sp = new Float32Array(S * 3), sph = new Float32Array(S), ssz = new Float32Array(S);
    for (let i = 0; i < S; i++) {
      sp[i * 3] = (Math.random() - 0.5) * 26; sp[i * 3 + 1] = (Math.random() - 0.3) * 16; sp[i * 3 + 2] = -6 - Math.random() * 10;
      sph[i] = Math.random(); ssz[i] = 0.8 + Math.random() * 1.8;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    starGeo.setAttribute("aPhase", new THREE.BufferAttribute(sph, 1));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(ssz, 1));
    const starU = { uTime, uPR: { value: dpr } };
    const stars = new THREE.Points(starGeo, new THREE.ShaderMaterial({ vertexShader: starVert, fragmentShader: starFrag, uniforms: starU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    scene.add(stars);

    // layout: planet centre sits on the bottom edge, so we see its upper half
    let baseR = 1.4, baseY = -1.1;
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      const halfW = halfH * camera.aspect;
      const portrait = camera.aspect < 0.9;
      // portrait screens get a planet wider than the screen, horizon near the middle
      baseR = portrait ? Math.min(1.2, halfW * 1.75) : Math.min(1.45, halfW * 1.05, halfH * 1.25);
      baseY = -halfH + baseR * (portrait ? 0.45 : 0.1);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // pointer: tilt + crescent points scatter away from the cursor
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, in: 0 };
    const ndc = new THREE.Vector2();
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();
    const zone = el.parentElement!;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
      mouse.in = e.pointerType === "mouse" ? 1 : 0;
    };
    const leave = () => { mouse.in = 0; };
    zone.addEventListener("pointermove", move);
    zone.addEventListener("pointerleave", leave);

    let progress = 0, prog = 0;
    onReady?.({ setProgress: (p) => { progress = p; if (reduce) draw(0); } });

    let last = performance.now();
    const delta = () => { const n = performance.now(); const d = (n - last) / 1000; last = n; return d; };
    let spin = 0;
    const draw = (dt: number) => {
      prog += (progress - prog) * Math.min(1, dt * 6 || 1);
      const p = prog;
      uTime.value += dt;
      spin += dt * (0.045 + p * 0.35);
      planet.rotation.y = spin;
      // the sun swings round as you scroll: crescent -> sunrise
      uLight.value.copy(light).lerp(lightEnd, THREE.MathUtils.smoothstep(p, 0.05, 0.7));
      mouse.x += (mouse.tx - mouse.x) * 0.06; mouse.y += (mouse.ty - mouse.y) * 0.06;
      const s = 1 + p * 0.55;
      world.scale.setScalar(baseR * s);
      world.position.y = baseY + p * baseR * 0.55;
      world.rotation.x = mouse.y * 0.06;
      world.rotation.y = mouse.x * 0.12;
      camera.position.z = 4.2 - THREE.MathUtils.smoothstep(p, 0.45, 1) * 2.4;
      camera.position.x = mouse.x * 0.08;
      camera.lookAt(0, camera.position.z < 3 ? world.position.y * 0.4 : 0, 0);
      ringU.uSpread.value = THREE.MathUtils.smoothstep(p, 0.08, 0.75);
      ringU.uHover.value += (mouse.in - ringU.uHover.value) * 0.08;
      if (ringU.uHover.value > 0.01) {
        ndc.set(mouse.x, mouse.y);
        ray.setFromCamera(ndc, camera);
        if (ray.ray.intersectPlane(plane, hit)) { world.worldToLocal(hit); ringU.uMouse.value.set(hit.x, hit.y); }
      }
      stars.position.y = -p * 1.5;
      renderer.render(scene, camera);
    };

    // render only while visible; drop resolution if frames run slow
    let visible = true, raf = 0, slow = 0, frames = 0;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf && !reduce) loop(); });
    io.observe(el);
    const loop = () => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(delta(), 0.05);
      draw(dt);
      if (++frames > 30 && frames < 400) {
        slow = slow * 0.9 + (dt > 0.024 ? 0.1 : 0);
        if (slow > 0.6 && dprCap > 0.75) {
          dprCap -= 0.25; dpr = Math.min(dpr, dprCap);
          renderer.setPixelRatio(dpr); ringU.uPR.value = dpr; starU.uPR.value = dpr; resize(); slow = 0;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    const vis = () => { if (!document.hidden && visible && !raf && !reduce) { delta(); loop(); } };
    document.addEventListener("visibilitychange", vis);
    if (reduce) draw(0.016); else loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", vis);
      zone.removeEventListener("pointermove", move);
      zone.removeEventListener("pointerleave", leave);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | undefined;
        mat?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
    // mount once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={host} className="planet-host absolute inset-0">
      {/* CSS fallback when WebGL is unavailable */}
      <div className="planet-fallback absolute left-1/2 -translate-x-1/2 top-[48%] w-[120vmin] aspect-square rounded-full" aria-hidden />
    </div>
  );
}
