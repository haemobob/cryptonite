/* eslint-disable @next/next/no-img-element */
export default function Sticker({ text, size = 132, className = "" }: { text: string; size?: number; className?: string }) {
  const id = `c${text.length}${size}`;
  return (
    <div className={`relative rounded-full bg-blue text-white grid place-items-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ animation: "spin 22s linear infinite" }} aria-hidden>
        <defs><path id={id} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
        <text fontSize="8.4" fontFamily="var(--font-mono)" letterSpacing="1.6" fill="currentColor">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <img src="/gem.png" alt="" className="w-[36%] h-auto rounded-full" />
    </div>
  );
}
