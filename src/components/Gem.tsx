// Vector take on the faceted gem in the Cryptonite logo (brilliant cut, seen from above).
// Built procedurally so it stays sharp at any scale — the hero zooms right into it.

type Pt = [number, number];
const C: Pt = [50, 50];
const at = (deg: number, r: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return [C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r];
};

const DARK = [0, 34, 140], MID = [0, 80, 240], LIGHT = [140, 205, 255];
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
function shade(pts: Pt[], bias = 0) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length - C[0];
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length - C[1];
  const len = Math.hypot(cx, cy) || 1;
  // light from the upper left
  let b = 0.5 + 0.5 * ((-cx - cy) / (len * Math.SQRT2)) + bias;
  b = Math.min(1, Math.max(0, b));
  const rgb = b < 0.55 ? mix(DARK, MID, b / 0.55) : mix(MID, LIGHT, (b - 0.55) / 0.45);
  return `rgb(${rgb.join(",")})`;
}

const FACETS: { d: string; fill: string }[] = (() => {
  const out: { d: string; fill: string }[] = [];
  const poly = (pts: Pt[], bias = 0) => out.push({ d: "M" + pts.map((p) => p.map((v) => v.toFixed(2)).join(" ")).join("L") + "Z", fill: shade(pts, bias) });
  const T = (k: number) => at(k * 45 + 22.5 - 90, 23);
  const P = (k: number) => at(k * 45 - 90, 36);
  const G = (deg: number) => at(deg - 90, 50.5);
  for (let k = 0; k < 8; k++) {
    poly([T(k - 1), P(k), T(k)], 0.08);                         // star
    poly([T(k), P(k), G(k * 45 + 22.5), P(k + 1)], k % 2 ? -0.06 : 0.04); // bezel
    poly([P(k), G(k * 45), G(k * 45 + 22.5)], -0.12);          // upper girdle
    poly([P(k), G(k * 45 - 22.5), G(k * 45)], 0.02);
  }
  return out;
})();
const TABLE = Array.from({ length: 8 }, (_, k) => at(k * 45 + 22.5 - 90, 23.2).map((v) => v.toFixed(2)).join(" ")).join(" ");

export default function Gem({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <clipPath id="gem-clip"><circle cx="50" cy="50" r="50" /></clipPath>
        <linearGradient id="gem-table" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7cc6ff" /><stop offset="1" stopColor="#1f6fff" />
        </linearGradient>
      </defs>
      <g clipPath="url(#gem-clip)">
        <circle cx="50" cy="50" r="50" fill="#0050f0" />
        {FACETS.map((f, i) => <path key={i} d={f.d} fill={f.fill} stroke={f.fill} strokeWidth="0.25" />)}
        <polygon points={TABLE} fill="url(#gem-table)" />
      </g>
    </svg>
  );
}
